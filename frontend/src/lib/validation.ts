import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(60, "Full name must be at most 60 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Full name must contain only letters, spaces, hyphens, or apostrophes"),

    email: z
        .string()
        .trim()
        .min(1, "Email address is required")
        .email("Enter a valid email address (e.g. user@example.com)")
        .regex(
            /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
            "Email format is invalid"
        ),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number is required")
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits (no spaces or dashes)"),

    batch: z
        .string()
        .trim()
        .min(1, "Batch is required")
        .max(20, "Batch name is too long")
        .regex(/^[a-zA-Z0-9]+$/, "Batch must be alphanumeric (e.g. BCE203)"),

    module: z
        .string()
        .trim()
        .min(1, "Module number is required")
        .regex(/^\d+$/, "Module must be a number")
        .refine(val => {
            const n = Number(val);
            return n >= 1 && n <= 99;
        }, "Module must be between 1 and 99"),

    consent: z
        .boolean()
        .refine(val => val === true, "You must agree to the Terms of Engagement to continue"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid credential format")
});

export const reportSchema = z.object({
    title: z.string().min(5, "Title is required (min 5 characters)"),
    description: z.string().min(10, "Detailed description is required"),
    steps: z.string().min(10, "Reproduction steps are required"),
    severity: z.string().min(1, "Severity is required"),
});
