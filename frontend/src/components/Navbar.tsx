import Link from 'next/link';

export const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl font-bold">shield_with_heart</span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Cyber Hunt</h2>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors text-slate-900 dark:text-slate-100">Challenges</Link>
                    <Link href="/#prizes" className="text-sm font-medium hover:text-primary transition-colors text-slate-900 dark:text-slate-100">Prizes</Link>
                    <Link href="/#faq" className="text-sm font-medium hover:text-primary transition-colors text-slate-900 dark:text-slate-100">FAQ</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">Login</Link>
                    <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
};
