import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: string;
    error?: string;
    helpText?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, icon, error, helpText, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = props.type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

        return (
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
                <div className="relative group">
                    {icon && (
                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`}>
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        type={inputType}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-full py-4 ${icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} 
              outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
              ${error
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                                : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary'
                            } ${className}`}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-[12px] text-red-500 flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {error}
                    </p>
                )}
                {helpText && !error && (
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                        {helpText}
                    </p>
                )}
            </div>
        );
    }
);
InputField.displayName = 'InputField';
