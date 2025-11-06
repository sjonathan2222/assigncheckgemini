import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon } from './icons';

interface FileUploadProps {
    title: string;
    onFileSelect: (file: File) => void;
    acceptedTypes: string;
    file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ title, onFileSelect, acceptedTypes, file }) => {
    const [isDragging, setIsDragging] = useState(false);
    const uniqueId = title.replace(/\s+/g, '-').toLowerCase();


    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    if (file) {
        return (
            <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
                <div className="flex items-center space-x-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                    <FileIcon />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {file.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            <label
                htmlFor={uniqueId}
                className={`flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-slate-800 hover:bg-gray-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-700 transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <UploadIcon />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">DOCX or PDF</p>
                </div>
                <input id={uniqueId} type="file" className="hidden" onChange={handleFileChange} accept={acceptedTypes} />
            </label>
        </div>
    );
}

export default FileUpload;