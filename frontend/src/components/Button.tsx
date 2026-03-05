import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', isLoading, children, ...props }, ref) => {
        const baseStyles = "transition-all font-bold flex items-center justify-center gap-2";

        const variants = {
            primary: "bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20",
            outline: "border-2 border-slate-300 dark:border-primary/30 hover:border-primary rounded-xl text-slate-900 dark:text-white",
            ghost: "text-slate-900 dark:text-white hover:text-primary transition-colors"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
