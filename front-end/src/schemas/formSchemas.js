import { z } from 'zod';

// Attendee Registration Schema
export const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(16, 'Must be at least 16 years old').max(120, 'Invalid age'),
  occupation: z.string().min(1, 'Occupation is required'),
  institution: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  motivation: z.string().min(10, 'Please provide more details')
});

// Speaker Application Schema
export const speakerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  occupation: z.string().min(1, 'Occupation is required'),
  institution: z.string().min(1, 'Institution is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  skills: z.string().min(10, 'Please describe your technical skills'),
  experience: z.string().min(10, 'Please describe your speaking experience'),
  topics: z.string().min(10, 'Please provide proposed topics'),
  achievements: z.string().optional()
});

// Partnership Schema
export const partnershipSchema = z.object({
  organization: z.string().min(2, 'Organization name is required'),
  email: z.string().email('Invalid email address'),
  category: z.string().min(1, 'Category is required')
});

// Auth Schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

