'use client';

import { useState, useEffect } from 'react';

export const RealTimeClock = () => {
    const [time, setTime] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const updateClock = () => {
            const now = new Date();
            // Format HH:MM:SS locally
            const formattedTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setTime(formattedTime);
        };

        updateClock(); // Initial call to avoid layout shift delay
        const timerId = setInterval(updateClock, 1000);

        return () => clearInterval(timerId);
    }, []);

    // Prevent hydration mismatch between server rendering and client actual local time
    if (!isMounted) return <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded border border-transparent"></div>;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded shadow-[0_0_15px_rgba(16,185,129,0.15)] select-none">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">watch</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tracking-widest text-sm">
                {time}
            </span>
        </div>
    );
};
