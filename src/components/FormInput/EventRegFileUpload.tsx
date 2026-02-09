import React, { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { EventRegFormSchema } from './EventRegFormUtils';

interface EventRegFileUploadProps {
    onFileSelect: (files: File[]) => void;
    name?: string;
    register?: UseFormRegister<EventRegFormSchema>;
    required?: boolean;
}

const EventRegFileUpload: React.FC<EventRegFileUploadProps> = ({
    name,
    onFileSelect,
    register,
    required,
}) => {
    const [uploadState, setUploadState] = useState<'initial' | 'uploading' | 'completed'>(
        'initial'
    );
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setUploadState('uploading');

            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setUploadState('completed');
                }
            }, 100);

            onFileSelect([file]);
        }
    };

    const handleReset = () => {
        setUploadState('initial');
        setProgress(0);
        setFileName('');
    };
    const containerClass = 'flex flex-col justify-center gap-2';
    const labelClass = 'mb-2 text-sm font-medium text-white';
    const uploadButtonClass =
        'inline-flex items-center gap-2 rounded-full border-2 border-[#5c5cff] bg-white px-6 py-3 text-sm text-[#5c5cff] transition-all hover:bg-[#f8f8ff]';
    const progressContainerClass = 'flex items-center gap-3 rounded-lg bg-[#f8f8ff] p-3';
    const fileIconClass =
        'flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b3b54] text-white';
    const progressBarClass = 'h-2 flex-1 overflow-hidden rounded bg-[#e0e0e0]';
    const progressFillClass = 'h-full bg-[#5c5cff] transition-all';
    const resetButtonClass = 'ml-auto cursor-pointer border-0 bg-transparent px-2 text-[#5c5cff]';

    return (
        <div className={containerClass}>
            <label className={labelClass}>
                {name}
                {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
            </label>

            {uploadState === 'initial' && (
                <div>
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        {...(register && register)}
                        required={required}
                    />
                    <label htmlFor="file-upload">
                        <span className={uploadButtonClass}>
                            Upload
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                            </svg>
                        </span>
                    </label>
                </div>
            )}

            {uploadState === 'uploading' && (
                <div className={progressContainerClass}>
                    <div className={fileIconClass}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div>{fileName}</div>
                        <div className={progressBarClass}>
                            <div className={progressFillClass} style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <div>{progress}%</div>
                </div>
            )}

            {uploadState === 'completed' && (
                <div className={progressContainerClass}>
                    <div className={fileIconClass}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <div>{fileName}</div>
                    <button className={resetButtonClass} onClick={handleReset} type="button">
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventRegFileUpload;
