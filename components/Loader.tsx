
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-8">Analyzing your work...</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">
                Our AI is meticulously reviewing your assignment against the criteria. This might take a moment.
            </p>
        </div>
    );
};

export default Loader;
