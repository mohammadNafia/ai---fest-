/**
 * Form Validation Schemas using Zod
 * TypeScript version with role support
 */

import { z } from 'zod';
import { normalizeRole } from '@/utils/roleUtils';
import type { UserRole } from '@/types';

// Role validation with normalization
const roleSchema = z.string().transform((val) => normalizeRole(val, 'user'));

// Sign In Schema with Role
// Password validation is flexible: admin can use "admin" (5 chars), others need 6+
export const signInSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  role: roleSchema.optional().default('user'),
}).superRefine((data, ctx) => {
  // Allow admin password "admin" (5 characters) for admin role
  // For other roles, require at least 6 characters
  const normalizedRole = data.role || 'user';
  
  if (normalizedRole === 'admin') {
    // Admin can use password "admin" (5 characters) or longer
    if (data.password.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 5,
        type: 'string',
        inclusive: true,
        path: ['password'],
        message: 'Password must be at least 5 characters',
      });
    }
  } else {
    // Other roles require at least 6 characters
    if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 6,
        type: 'string',
        inclusive: true,
        path: ['password'],
        message: 'Password must be at least 6 characters',
      });
    }
  }
});

// Register Schema (also exported as signUpSchema for backward compatibility)
export const registerSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  confirmPassword: z.string(),
  role: roleSchema.optional().default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Attendee Registration Schema
export const attendeeSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  age: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }),
  occupation: z.string().min(2, {
    message: 'Occupation is required',
  }),
  organization: z.string().min(2, {
    message: 'Organization / University is required',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number',
  }),
  motivation: z.string().min(10, {
    message: 'Please provide your motivation (at least 10 characters)',
  }),
  newsletter: z.boolean().optional().default(false),
});

// Speaker Registration Schema
export const speakerSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  occupation: z.string().min(2, {
    message: 'Occupation is required',
  }),
  institution: z.string().min(2, {
    message: 'Institution is required',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number',
  }),
  skills: z.string().min(10, {
    message: 'Please describe your skills',
  }),
  experience: z.string().min(10, {
    message: 'Please describe your experience',
  }),
  topics: z.string().min(5, {
    message: 'Please list your topics',
  }),
  achievements: z.string().min(10, {
    message: 'Please list your achievements',
  }),
});

// Partner Registration Schema (also exported as partnershipSchema for backward compatibility)
export const partnerSchema = z.object({
  organization: z.string().min(2, {
    message: 'Organization name is required',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  category: z.string().min(2, {
    message: 'Category is required',
  }),
  requirements: z.string().optional(),
});

// Backward compatibility exports
export const signUpSchema = registerSchema;
export const partnershipSchema = partnerSchema;

// Export types
export type SignInFormData = z.infer<typeof signInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AttendeeFormData = z.infer<typeof attendeeSchema>;
export type SpeakerFormData = z.infer<typeof speakerSchema>;
export type PartnerFormData = z.infer<typeof partnerSchema>;

3