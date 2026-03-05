/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema } from "@/lib/validation";
import { api } from "@/lib/api";
import { FileUpload } from "@/components/FileUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        // Quick and dirty auth check for demo
        const token = localStorage.getItem('cyberhunt_token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(reportSchema)
    });

    const onSubmit = async (data: any) => {
        if (!file) {
            toast.error('Proof attachment is required');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            formData.append('proof', file);

            await api.submitReport(formData);
            toast.success("Vulnerability report successfully encrypted and transmitted.");
            reset();
            setFile(null);
        } catch (err: any) {
            toast.error(err.message || "Submission failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <aside className="w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6">
                <div className="flex flex-col gap-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">security</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Cyber Hunt</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Vulnerability Researcher</p>
                        </div>
                    </Link>

                    <nav className="flex flex-col gap-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined">grid_view</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link href="/submissions" className="flex items-center gap-3 px-4 py-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">description</span>
                            <span className="text-sm font-medium">Reports</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">database</span>
                            <span className="text-sm font-medium">Bounties</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">trophy</span>
                            <span className="text-sm font-medium">Leaderboard</span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Operator</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Pro Hunter • Level 42</p>
                    </div>
                    <button onClick={() => {
                        localStorage.removeItem('cyberhunt_token');
                        router.push('/');
                        toast.success("Logged out");
                    }} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500 transition-colors">logout</button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-10 py-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur z-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Submit Vulnerability</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Contribute to the security of the ecosystem.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                            $12,450.00 Earned
                        </div>
                    </div>
                </header>

                <section className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Vulnerability Title</label>
                            <input
                                type="text"
                                {...register("title")}
                                placeholder="e.g. SQL Injection on User Profile API"
                                className={`w-full bg-white dark:bg-slate-900 border rounded-lg p-4 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.title ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'}`}
                            />
                            {errors.title && <p className="text-[12px] text-red-500">{errors.title.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
                            <textarea
                                rows={4}
                                {...register("description")}
                                placeholder="Provide a high-level overview of the discovery and its potential impact..."
                                className={`w-full bg-white dark:bg-slate-900 border rounded-lg p-4 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.description ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'}`}
                            ></textarea>
                            {errors.description && <p className="text-[12px] text-red-500">{errors.description.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Steps to Reproduce</label>
                            <textarea
                                rows={6}
                                {...register("steps")}
                                placeholder="1. Navigate to /api/v1/user&#10;2. Set the Authorization header&#10;3. Observe the response"
                                className={`w-full bg-slate-50 dark:bg-slate-950 border font-mono text-sm rounded-lg p-4 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.steps ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'}`}
                            ></textarea>
                            {errors.steps && <p className="text-[12px] text-red-500">{errors.steps.message as string}</p>}
                        </div>

                        <FileUpload
                            label="Evidence &amp; Attachments"
                            onChange={(f) => setFile(f)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Severity Level</label>
                                <select {...register("severity")} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                    <option value="Informational">Informational</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Target Asset</label>
                                <select {...register("target")} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                                    <option value="api.cyberhunt.com">Core API (api.cyberhunt.com)</option>
                                    <option value="app.cyberhunt.com">Web Dashboard (app.cyberhunt.com)</option>
                                    <option value="mobile">Mobile Application (iOS/Android)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <button type="button" className="px-6 py-2.5 rounded font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                Save as Draft
                            </button>
                            <button disabled={isLoading} type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                                Finalize &amp; Submit Report
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
