import React from 'react';
import { AnalysisResult, CriterionAnalysis } from '../types';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, SparklesIcon } from './icons';

interface ResultsDisplayProps {
    result: AnalysisResult;
    onReset: () => void;
}

const getGradeColor = (grade: string) => {
    switch (grade) {
        case 'Distinction':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        case 'Merit':
            return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
        case 'Pass':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Not Achieved':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const markdownToHtml = (markdown: string) => {
    if (!markdown) return "";
    // Converts lines starting with - or * into <li> elements and wraps them in a <ul>
    const listItems = markdown
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return `<li>${trimmedLine.substring(2)}</li>`;
            }
             // For lines that are not list items, wrap them in a list item for consistency
            return `<li>${trimmedLine}</li>`;
        })
        .join('');
    return `<ul>${listItems}</ul>`;
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Analysis Complete</h2>
                <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl sm:tracking-tight md:text-5xl">
                    Your Result
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Achieved Grade</h3>
                    <p className={`mt-2 text-3xl sm:text-4xl font-bold px-4 py-2 rounded-lg ${getGradeColor(result.achievedGrade)}`}>
                        {result.achievedGrade}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Completion</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mt-4">
                        <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${result.completionPercentage}%` }}></div>
                    </div>
                    <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{result.completionPercentage}%</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Criteria Breakdown</h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                        {result.criteriaAnalysis.map((item, index) => (
                            <li key={index} className="p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {item.isFulfilled ? <CheckCircleIcon /> : <XCircleIcon />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-md font-bold text-gray-900 dark:text-white">{item.criterion}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.explanation}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-4">
                        <span className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mr-3">
                            <LightbulbIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Suggestions for Improvement</h3>
                    </div>
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-li:my-2 prose-ul:pl-1 text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: markdownToHtml(result.suggestionsForImprovement) }} />
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                     <div className="flex items-center mb-4">
                        <span className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-3">
                            <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tips & Tricks</h3>
                    </div>
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-li:my-2 prose-ul:pl-1 text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: markdownToHtml(result.tipsAndTricks) }} />
                </div>
            </div>

            <div className="text-center pt-4">
                 <button onClick={onReset} className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Check Another Assignment
                </button>
            </div>
        </div>
    );
};

export default ResultsDisplay;