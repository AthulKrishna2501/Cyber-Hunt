/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { api } from "@/lib/api";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await api.login(data);
            localStorage.setItem('cyberhunt_token', res.token);
            localStorage.setItem('cyberhunt_user', res.fullName);
            localStorage.setItem('cyberhunt_user_email', data.email);
            toast.success("Authorization granted. Accessing Mainframe...");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (err: any) {
            toast.error(err.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-primary/20 px-6 py-4 bg-background-light dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl font-bold flex items-center">shield_with_heart</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase flex items-center mb-0 mt-1">Cyber Hunt</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-primary/10 text-slate-700 dark:text-primary transition-colors hover:bg-primary/20">
                        <span className="material-symbols-outlined">shield_lock</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-primary/20 rounded-[2rem] shadow-2xl backdrop-blur-sm overflow-hidden">
                        <div className="p-8">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight mb-2">Terminal Login</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Secure authorization required to access mainframe</p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)(e);
                                }}
                                method="POST"
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Identifier
                                    </label>
                                    <div className="relative group">
                                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`}>alternate_email</span>
                                        <input
                                            type="email"
                                            placeholder="operator@cyberhunt.io"
                                            {...register("email")}
                                            className={`w-full bg-slate-50 dark:bg-background-dark/50 border rounded-full py-4 pl-12 pr-4 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                                        />
                                    </div>
                                    {errors.email && <p className="text-[12px] text-red-500 flex items-center gap-1 font-medium mt-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.email.message as string}</p>}
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" isLoading={isLoading} className="w-full py-4 tracking-wide uppercase !rounded-full">
                                        {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                                        EXECUTE LOGIN
                                    </Button>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Request Access Port</Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-100 dark:border-primary/10 flex justify-center">
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Encrypted Connection (AES-256-GCM)
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-slate-500 text-xs">
                        Unauthorized access to this terminal is strictly prohibited.<br />
                        Monitoring is active. IP: 192.168.1.101
                    </p>
                </div>
            </main>
        </div>
    );
}
