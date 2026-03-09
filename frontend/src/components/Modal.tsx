import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'info' | 'warning';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${type === 'error' ? 'bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400' :
                                        type === 'success' ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            'bg-primary/10 text-primary'
                                    }`}>
                                    <span className="material-symbols-outlined text-4xl">
                                        {type === 'error' ? 'error' :
                                            type === 'success' ? 'check_circle' :
                                                'info'}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
