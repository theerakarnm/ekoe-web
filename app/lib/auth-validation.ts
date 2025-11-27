import { z } from 'zod';

/**
 * Centralized validation schemas for authentication forms
 * 
 * These schemas ensure consistent validation across all auth-related forms
 * and can be used with React Hook Form's zodResolver.
 * 
 * @example
 * import { loginSchema, type LoginFormData } from '~/lib/auth-validation';
 * 
 * const form = useForm<LoginFormData>({
 *   resolver: zodResolver(loginSchema),
 * });
 */

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 */ 
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
});

export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long')
    .trim()
    .optional()
    .nullable(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long')
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +1234567890)')
    .optional()
    .nullable(),
  dateOfBirth: z
    .coerce
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 13;
    }, 'You must be at least 13 years old')
    .optional()
    .nullable(),
  newsletterSubscribed: z.boolean().optional(),
  smsSubscribed: z.boolean().optional(),
  language: z.enum(['en', 'th']).optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
