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

    useEffect(() => {
        // Quick auth check
        const token = localStorage.getItem('cyberhunt_token');
        if (!token) {
            router.push('/login');
            return;
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
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-10 py-3 bg-white dark:bg-background-dark">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-4 text-primary">
                        <div className="size-6 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">shield_person</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Cyber Hunt</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-9">
                        <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                        <Link href="/submissions" className="text-primary text-sm font-bold border-b-2 border-primary py-1">Submissions</Link>
                        <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors">Analytics</Link>
                        <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors">Settings</Link>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded h-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <div className="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input className="w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-slate-500 text-sm pl-2 pr-4 outline-none text-slate-900 dark:text-slate-100" placeholder="Search intercepts..." />
                        </div>
                    </div>
                    <Link href="/dashboard" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-opacity hover:opacity-90">
                        <span className="truncate">New Submission</span>
                    </Link>
                    <button onClick={() => {
                        localStorage.removeItem('cyberhunt_token');
                        router.push('/');
                        toast.success("Logged out");
                    }} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-red-500 transition-colors ml-2">logout</button>
                </div>
            </header>

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Submissions Log</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base">Manage and track vulnerability reports for the global network</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Intercepts</p>
                            <span className="material-symbols-outlined text-primary">analytics</span>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">1,284</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Verified Nodes</p>
                            <span className="material-symbols-outlined text-emerald-500">verified</span>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">856</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Analysis</p>
                            <span className="material-symbols-outlined text-amber-500">hourglass_empty</span>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight">42</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500">
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            <p className="mt-2 text-sm">Decrypting Packets...</p>
                                        </td>
                                    </tr>
                                ) : submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                                            No intercepts found.
                                        </td>
                                    </tr>
                                ) : submissions.map((sub, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{sub.title}</span>
                                                <span className="text-slate-400 text-xs">VULN-ID: {sub.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{sub.date}</td>
                                        <td className="px-6 py-4">
                                            {sub.status === 'Verified' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                    Verified
                                                </span>
                                            )}
                                            {sub.status === 'Pending' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    Pending
                                                </span>
                                            )}
                                            {sub.status === 'Rejected' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:text-slate-900 dark:hover:text-white transition-colors text-slate-400">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                            </div>
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
