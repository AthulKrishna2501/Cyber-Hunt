import React, { useCallback, useState } from 'react';
import { Modal } from './Modal';

interface FileUploadProps {
    label: string;
    onChange: (file: File | null) => void;
    error?: string;
    accept?: string;
    maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    label,
    onChange,
    error,
    accept = ".pdf,.doc,.docx,.png,.jpg,.log",
    maxSizeMB = 10
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                setIsModalOpen(true);
                return;
            }
        }
        setSelectedFile(file);
        onChange(file);
    }, [maxSizeMB, onChange]);

    return (
        <div className="space-y-2">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Transmission Blocked"
                message={`The payload size exceeds the maximum limit of ${maxSizeMB}MB. Please compress and retry.`}
                type="error"
            />

            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {label}
            </label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-10 flex flex-col items-center justify-center gap-4 group hover:border-primary/50 transition-colors cursor-pointer">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <div className="text-center pointer-events-none">
                    {selectedFile ? (
                        <p className="text-sm font-bold text-primary truncate max-w-xs">{selectedFile.name}</p>
                    ) : (
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Click to upload or drag and drop</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {accept.replace(/\./g, '').toUpperCase()} files (max. {maxSizeMB}MB)
                    </p>
                </div>
            </div>
            {error && (
                <p className="text-[12px] text-red-500 flex items-center gap-1 font-medium mt-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};
