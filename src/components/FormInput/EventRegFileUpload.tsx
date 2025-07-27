import React, { useState } from 'react';
import {
    FileUploadContainer,
    UploadLabel,
    UploadButton,
    ProgressContainer,
    FileIcon,
    ProgressBar,
} from './EventRegFileUpload.styles';
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

    return (
        <FileUploadContainer>
            <UploadLabel>
                {name}
                {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
            </UploadLabel>

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
                        <UploadButton as="span">
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
                        </UploadButton>
                    </label>
                </div>
            )}

            {uploadState === 'uploading' && (
                <ProgressContainer>
                    <FileIcon>
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
                    </FileIcon>
                    <div style={{ flex: 1 }}>
                        <div>{fileName}</div>
                        <ProgressBar progress={progress} />
                    </div>
                    <div>{progress}%</div>
                </ProgressContainer>
            )}

            {uploadState === 'completed' && (
                <ProgressContainer>
                    <FileIcon>
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
                    </FileIcon>
                    <div>{fileName}</div>
                    <UploadButton
                        as="span"
                        onClick={handleReset}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '0 8px',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </UploadButton>
                </ProgressContainer>
            )}
        </FileUploadContainer>
    );
};

export default EventRegFileUpload;
