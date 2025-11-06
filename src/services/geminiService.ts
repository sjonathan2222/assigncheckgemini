import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        achievedGrade: {
            type: Type.STRING,
            description: "The final grade: 'Distinction', 'Merit', 'Pass', or 'Not Achieved'.",
            enum: ['Distinction', 'Merit', 'Pass', 'Not Achieved'],
        },
        criteriaAnalysis: {
            type: Type.ARRAY,
            description: "An array containing a detailed analysis for each criterion.",
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING, description: "The criterion code, e.g., P1, M2, D1." },
                    isFulfilled: { type: Type.BOOLEAN, description: "True if the criterion is met, false otherwise." },
                    explanation: { type: Type.STRING, description: "A detailed explanation of why the criterion was or was not met, including quotes from the assignment." }
                },
                required: ['criterion', 'isFulfilled', 'explanation']
            }
        },
        completionPercentage: {
            type: Type.NUMBER,
            description: "An overall completion percentage (0-100) based on the total number of criteria met."
        },
        suggestionsForImprovement: {
            type: Type.STRING,
            description: "Provide 2-3 concise, actionable suggestions for any unmet criteria. Keep each suggestion to one sentence. Formatted as a Markdown list."
        },
        tipsAndTricks: {
            type: Type.STRING,
            description: "Provide 2-3 brief, general tips for improving assignment quality. Keep each tip to one sentence. Formatted as a Markdown list."
        }
    },
    required: ['achievedGrade', 'criteriaAnalysis', 'completionPercentage', 'suggestionsForImprovement', 'tipsAndTricks']
};

export const analyzeAssignment = async (assignmentContent: string, criteriaContent: string): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    You are an expert academic assessor named AssignCheck. Your task is to evaluate a student's assignment strictly against the provided grading criteria.

    **GRADING RULES (Follow these strictly):**
    1.  **Pass:** ALL 'P' criteria (P1, P2, etc.) MUST be fulfilled.
    2.  **Merit:** ALL 'P' criteria AND ALL 'M' criteria (M1, M2, etc.) MUST be fulfilled.
    3.  **Distinction:** ALL 'P', ALL 'M', and ALL 'D' criteria (D1, D2, etc.) MUST be fulfilled.
    4.  **Not Achieved:** If ANY 'P' criterion is not fulfilled, the grade is 'Not Achieved', regardless of other fulfilled criteria.
    5.  **Downgrades:**
        - If all 'P' criteria are met but one or more 'M' criteria are not, the grade is 'Pass'.
        - If all 'P' and 'M' criteria are met but one or more 'D' criteria are not, the grade is 'Merit'.

    **INSTRUCTIONS:**
    1.  Identify all criteria codes (P1, P2..., M1, M2..., D1, D2...) from the provided criteria text.
    2.  For each criterion, meticulously check the assignment text to determine if it has been met.
    3.  Provide a detailed explanation for each criterion, quoting relevant parts from the assignment to justify your assessment.
    4.  Determine the final grade based on the strict grading rules above.
    5.  Calculate a completion percentage based on the total number of criteria met out of the total available.
    6.  Provide 2-3 concise, actionable suggestions for improvement for any unmet criteria. Keep each suggestion to one sentence.
    7.  Offer 2-3 brief, general tips and tricks for improving the assignment quality. Keep each tip to one sentence.
    
    **CRITERIA TEXT:**
    ---
    ${criteriaContent}
    ---

    **ASSIGNMENT TEXT:**
    ---
    ${assignmentContent}
    ---

    Your final output must be a single JSON object matching the provided schema. Do not include any other text, comments, or markdown formatting outside of the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid analysis from the AI. The model may have returned an unexpected format. Please try again.");
    }
};