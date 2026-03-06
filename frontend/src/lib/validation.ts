import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    batch: z.string().min(1, "Batch is required"),
    module: z.string().min(1, "Module is required"),
    consent: z.boolean().refine(val => val === true, "You must agree to the terms")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid credential format")
});

export const reportSchema = z.object({
    title: z.string().min(5, "Title is required (min 5 characters)"),
    description: z.string().min(10, "Detailed description is required"),
    steps: z.string().min(10, "Reproduction steps are required"),
    severity: z.string().min(1, "Severity is required"),
    target: z.string().min(1, "Target is required"),
});
