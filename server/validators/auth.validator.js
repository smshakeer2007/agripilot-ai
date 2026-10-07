import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  farm_name: z.string().min(1, 'Farm / Organization Name is required'),
  farming_sector: z.string().optional().default('Horticulture'),
  farming_approach: z.string().optional().default('Integrated Pest Management (IPM)'),
  primary_goal: z.string().optional().default('Maximize Yield & Reduce Disease'),
  risk_alert_threshold: z.string().optional().default('Medium')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  farm_name: z.string().min(1).optional(),
  farming_sector: z.string().optional(),
  farming_approach: z.string().optional(),
  primary_goal: z.string().optional(),
  risk_alert_threshold: z.string().optional()
});
