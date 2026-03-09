/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
    const [userName, setUserName] = useState("Operator");
    const [targetUrl, setTargetUrl] = useState("https://target.cyberhunt.com");
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm({
        resolver: zodResolver(reportSchema)
    });

    const formValues = useWatch({ control });

    const handleSaveDraft = () => {
        localStorage.setItem('cyberhunt_report_draft', JSON.stringify(formValues));
        toast.success("Draft saved locally");
    };

    useEffect(() => {
        const token = localStorage.getItem('cyberhunt_access_token');
        const storedUser = localStorage.getItem('cyberhunt_user');
        const storedTarget = localStorage.getItem('cyberhunt_target_url');

        if (!token) {
            router.push('/login');
            return;
        }
        if (storedUser) {
            setUserName(storedUser);
        }
        if (storedTarget) {
            setTargetUrl(storedTarget);
        }

        // Load Draft
        const draft = localStorage.getItem('cyberhunt_report_draft');
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                if (parsedDraft.title) setValue("title", parsedDraft.title);
                if (parsedDraft.description) setValue("description", parsedDraft.description);
                if (parsedDraft.steps) setValue("steps", parsedDraft.steps);
                if (parsedDraft.severity) setValue("severity", parsedDraft.severity);
                toast.success("Restored unsaved draft");
            } catch (e) {
                // Ignore parsing errors for old/corrupted drafts
            }
        }

        const fetchRecentSubmissions = async () => {
            try {
                const data = await api.getSubmissions();
                setSubmissions(data.slice(0, 3)); // Just show last 3
            } catch (err) {
                // Silently fail
            } finally {
                setIsSubmissionsLoading(false);
            }
        };
        fetchRecentSubmissions();
    }, [router, setValue]);

    const [loadingStage, setLoadingStage] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        if (!file) {
            toast.error('Proof attachment is required');
            return;
        }

        setIsLoading(true);
        setLoadingStage("Transmitting Evidence...");
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (cloudName && uploadPreset) {
                // Direct-to-Cloud Upload
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', file);
                cloudinaryData.append('upload_preset', uploadPreset);

                const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                    method: 'POST',
                    body: cloudinaryData,
                });

                if (!cloudinaryRes.ok) {
                    throw new Error("Direct-to-Cloud upload failed check preset settings");
                }
                const cloudResData = await cloudinaryRes.json();
                formData.append('proofUrl', cloudResData.secure_url);
            } else {
                // Fallback path: standard backend upload
                formData.append('proof', file);
            }

            setLoadingStage("Finalizing Transmission...");
            const result = await api.submitReport(formData);

            toast.success("Vulnerability report successfully encrypted and transmitted.");
            reset();
            setFile(null);
            localStorage.removeItem('cyberhunt_report_draft'); // Clear draft on success

            // Optimistic UI Update: Use the result immediately instead of re-fetching
            if (result && result.report) {
                setSubmissions(prev => [result.report, ...prev].slice(0, 3));
            }
        } catch (err: any) {
            toast.error(err.message || "Submission failed");
        } finally {
            setIsLoading(false);
            setLoadingStage(null);
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
                            <span className="material-symbols-outlined">edit_document</span>
                            <span className="text-sm font-medium">Submit Report</span>
                        </Link>
                        <Link href="/submissions" className="flex items-center gap-3 px-4 py-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">description</span>
                            <span className="text-sm font-medium">Reports</span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Vulnerability Researcher</p>
                    </div>
                    <button onClick={() => {
                        api.logout();
                        toast.success("Logged out");
                    }} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500 transition-colors">logout</button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-10 py-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur z-10">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold tracking-tight">Submit Vulnerability</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Contribute to the security of the ecosystem.</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 px-4 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Primary Target Scan</span>
                        <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">{targetUrl}</code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(targetUrl);
                                    toast.success("Target URL copied to clipboard");
                                }}
                                className="material-symbols-outlined text-sm text-primary hover:scale-110 transition-transform cursor-pointer"
                            >
                                content_copy
                            </button>
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
                                placeholder={`1. Navigate to /api/v1/user\n2. Set the Authorization header\n3. Observe the response`}
                                className={`w-full bg-slate-50 dark:bg-slate-950 border font-mono text-sm rounded-lg p-4 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.steps ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'}`}
                            ></textarea>
                            {errors.steps && <p className="text-[12px] text-red-500">{errors.steps.message as string}</p>}
                        </div>

                        <FileUpload
                            label="Evidence &amp; Attachments"
                            onChange={(f) => setFile(f)}
                        />

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

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="px-6 py-2.5 rounded font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                Save as Draft
                            </button>
                            <button disabled={isLoading} type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                                {isLoading ? loadingStage : "Finalize & Submit Report"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-16 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold border-l-4 border-primary pl-4">Recently Logged Submissions</h3>
                            <Link href="/submissions" className="text-sm text-primary hover:underline">View All Intercepts</Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {isSubmissionsLoading ? (
                                <div className="p-8 text-center text-slate-500">
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">No recent submissions found.</div>
                            ) : (
                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {submissions.map((sub, idx) => (
                                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{sub.title}</span>
                                                <span className="text-xs text-slate-400">{sub.date} • {sub.id}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 ${sub.status === 'Verified' ? 'text-emerald-500' : ''}`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
