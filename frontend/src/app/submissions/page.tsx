/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Submissions() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("Operator");

    useEffect(() => {
        const token = localStorage.getItem('cyberhunt_token');
        const storedUser = localStorage.getItem('cyberhunt_user');

        if (!token) {
            router.push('/login');
            return;
        }
        if (storedUser) {
            setUserName(storedUser);
        }

        const fetchSubmissions = async () => {
            try {
                const data = await api.getSubmissions();
                setSubmissions(data);
            } catch (err) {
                toast.error("Failed to fetch submissions log");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, [router]);

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
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">edit_document</span>
                            <span className="text-sm font-medium">Submit Report</span>
                        </Link>
                        <Link href="/submissions" className="flex items-center gap-3 px-4 py-3 rounded bg-primary/10 text-primary transition-colors">
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
                        localStorage.removeItem('cyberhunt_token');
                        localStorage.removeItem('cyberhunt_user');
                        router.push('/');
                        toast.success("Logged out");
                    }} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500 transition-colors">logout</button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark px-10 py-8">
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Submissions Log</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">Manage and track vulnerability reports for the global network</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date/ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                                            <p className="mt-2 text-sm">Decrypting Packets...</p>
                                        </td>
                                    </tr>
                                ) : submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500 text-sm">
                                            No intercepts found in the database.
                                        </td>
                                    </tr>
                                ) : submissions.map((sub, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{sub.title}</span>
                                                <span className="text-slate-400 text-xs truncate max-w-xs">{sub.target}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-xs">
                                            <div>{sub.date}</div>
                                            <div className="font-mono text-primary/70">{sub.id}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sub.status === 'Verified'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                                    : sub.status === 'Pending'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
