/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import { api } from "@/lib/api";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await api.register(data);
            localStorage.setItem('cyberhunt_user', res.fullName);
            localStorage.setItem('cyberhunt_user_email', data.email);
            toast.success("Identity established. Credentials accepted.");
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="layout-container flex h-full grow flex-col">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-2 bg-background-light dark:bg-background-dark sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl font-bold">shield_with_heart</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Cyber Hunt</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Secure Environment</span>
                    <button className="flex items-center justify-center rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-xl">help_outline</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-2 lg:py-2 px-4 overflow-y-auto">
                <div className="layout-content-container flex flex-col max-w-[800px] w-full gap-4 mt-2">
                    <div className="bg-white dark:bg-slate-900/50 p-6 lg:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Professional Enrollment</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please provide your official credentials for system clearance.</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(onSubmit)(e);
                            }}
                            method="POST"
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Full Name"
                                    icon="person"
                                    placeholder="Full Name"
                                    {...register("fullName")}
                                    error={errors.fullName?.message as string}
                                />
                                <InputField
                                    label="Email Address"
                                    icon="alternate_email"
                                    type="email"
                                    placeholder="sample@gmail.com"
                                    {...register("email")}
                                    error={errors.email?.message as string}
                                />
                                <InputField
                                    label="Phone Number"
                                    icon="call"
                                    type="tel"
                                    placeholder="1234567890"
                                    {...register("phone")}
                                    error={errors.phone?.message as string}
                                />

                                <InputField
                                    label="Batch"
                                    icon="workspaces"
                                    type="text"
                                    placeholder="e.g. BCE203"
                                    {...register("batch")}
                                    error={errors.batch?.message as string}
                                />

                                <InputField
                                    label="Module"
                                    icon="assignment_turned_in"
                                    type="number"
                                    placeholder="11"
                                    {...register("module")}
                                    error={errors.module?.message as string}
                                />

                                <div className="hidden md:block"></div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                <input type="checkbox" {...register("consent")} className="mt-1.5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-white dark:bg-slate-900 cursor-pointer" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        I acknowledge that I am accessing a high-security environment. I agree to the <Link href="#" className="text-primary hover:underline">Terms of Engagement</Link> and the <Link href="#" className="text-primary hover:underline">Data Confidentiality Protocol</Link>.
                                    </p>
                                    {errors.consent && <p className="text-[12px] text-red-500 font-medium">{errors.consent.message as string}</p>}
                                </div>
                            </div>

                            <Button type="submit" isLoading={isLoading} className="w-full py-4 tracking-wide uppercase !rounded-full">
                                {!isLoading && <span className="material-symbols-outlined">fingerprint</span>}
                                Establish Identity
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Already have clearance? <Link href="/login" className="text-primary font-semibold hover:underline">Log in to portal</Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-widest border-t border-slate-200 dark:border-slate-800 pt-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            256-Bit SSL Encrypted
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">gpp_maybe</span>
                            GDPR Compliant Architecture
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-sm">circle</span>
                            System Status: Operational
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
