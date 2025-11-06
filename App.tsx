import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import ResultsDisplay from './components/ResultsDisplay';
import { extractTextFromFile } from './helpers/fileReader';
import { analyzeAssignment } from './services/geminiService';

enum AppStep {
    UPLOAD_ASSIGNMENT,
    UPLOAD_CRITERIA,
    ANALYZING,
    SHOW_RESULTS
}

function App() {
    const [step, setStep] = useState<AppStep>(AppStep.UPLOAD_ASSIGNMENT);
    const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
    const [criteriaFile, setCriteriaFile] = useState<File | null>(null);
    const [assignmentContent, setAssignmentContent] = useState<string>('');
    const [criteriaContent, setCriteriaContent] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileProcessing = async (file: File, setContent: React.Dispatch<React.SetStateAction<string>>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        setError(null);
        setFile(file);
        try {
            const text = await extractTextFromFile(file);
            setContent(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during file processing.');
            setFile(null); // Clear file on error
        }
    };
    
    const handleAssignmentFileSelect = (file: File) => {
        handleFileProcessing(file, setAssignmentContent, setAssignmentFile);
    };

    const handleCriteriaFileSelect = (file: File) => {
        handleFileProcessing(file, setCriteriaContent, setCriteriaFile);
    };

    const handleAnalyze = useCallback(async () => {
        if (!assignmentContent || !criteriaContent) {
            setError("Both assignment and criteria content are required.");
            return;
        }
        setError(null);
        setStep(AppStep.ANALYZING);

        try {
            const result = await analyzeAssignment(assignmentContent, criteriaContent);
            setAnalysisResult(result);
            setStep(AppStep.SHOW_RESULTS);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
            setStep(AppStep.UPLOAD_CRITERIA); // Go back to criteria step on error
        }
    }, [assignmentContent, criteriaContent]);

    const resetState = () => {
        setStep(AppStep.UPLOAD_ASSIGNMENT);
        setAssignmentFile(null);
        setCriteriaFile(null);
        setAssignmentContent('');
        setCriteriaContent('');
        setAnalysisResult(null);
        setError(null);
    };

    const renderStep = () => {
        switch (step) {
            case AppStep.UPLOAD_ASSIGNMENT:
                return (
                    <div className="space-y-6">
                        <FileUpload
                            title="Step 1: Upload Your Assignment"
                            onFileSelect={handleAssignmentFileSelect}
                            acceptedTypes=".docx,.pdf"
                            file={assignmentFile}
                        />
                         <button
                            onClick={() => setStep(AppStep.UPLOAD_CRITERIA)}
                            disabled={!assignmentFile}
                            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            Next: Add Criteria
                        </button>
                    </div>
                );
            case AppStep.UPLOAD_CRITERIA:
                return (
                     <div className="space-y-6">
                        <FileUpload
                            title="Step 2: Upload Assignment Criteria"
                            onFileSelect={handleCriteriaFileSelect}
                            acceptedTypes=".docx,.pdf"
                            file={criteriaFile}
                        />
                        <div className="flex flex-col sm:flex-row-reverse gap-4">
                             <button
                                onClick={handleAnalyze}
                                disabled={!criteriaFile}
                                className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                Analyze Assignment
                            </button>
                             <button
                                onClick={() => setStep(AppStep.UPLOAD_ASSIGNMENT)}
                                className="w-full px-6 py-3 border border-slate-300 text-base font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                );
            case AppStep.ANALYZING:
                return <Loader />;
            case AppStep.SHOW_RESULTS:
                return analysisResult ? <ResultsDisplay result={analysisResult} onReset={resetState} /> : null;
            default:
                return <div>Invalid step</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <header className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                        Assign<span className="text-indigo-600 dark:text-indigo-400">Check</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                        Get instant, AI-powered feedback on your assignments.
                    </p>
                </header>
                
                <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {error && (
                        <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-300" role="alert">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}
                    {renderStep()}
                </div>

                 <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} AssignCheck. Powered by Gemini.</p>
                </footer>
            </main>
        </div>
    );
}

export default App;
