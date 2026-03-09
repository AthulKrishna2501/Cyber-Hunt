'use client';

import React from 'react';
import toast from 'react-hot-toast';

interface ReportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any; // Assuming 'any' for now, can be properly typed using the models
}

export default function ReportPreviewModal({ isOpen, onClose, report }: ReportPreviewModalProps) {
    if (!isOpen || !report) return null;

    const handleCopy = () => {
        const details = `
Title: ${report.title}
ID: ${report.id}
Status: ${report.status}
Date: ${report.date}
Severity: ${report.severity}

Description:
${report.description}

Steps to Reproduce:
${report.steps}

Proof URL: ${report.attachmentPath}
        `.trim();

        navigator.clipboard.writeText(details);
        toast.success("Report details copied to clipboard!");
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{report.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-primary/70">{report.id}</span>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{report.date}</span>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${report.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : report.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                }`}>
                                {report.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Severity Level</h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${report.severity === 'Critical' ? 'bg-rose-500 text-white' :
                                report.severity === 'High' ? 'bg-orange-500 text-white' :
                                    report.severity === 'Medium' ? 'bg-amber-500 text-white' :
                                        'bg-slate-500 text-white'
                                }`}>
                                {report.severity}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{report.description}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Steps to Reproduce</h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-[13px]">{report.steps}</p>
                        </div>
                    </div>

                    {report.attachmentPath && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Attached Evidence</h3>
                            <a
                                href={report.attachmentPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors group"
                            >
                                <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined">link</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-primary truncate">View Original File</p>
                                    <p className="text-xs text-primary/70 truncate">{report.attachmentPath}</p>
                                </div>
                                <span className="material-symbols-outlined text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 mt-auto">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                        Copy Details
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark active:bg-primary/90 rounded-lg transition-all shadow-sm shadow-primary/30 active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
