import { z } from 'zod';

export const createFieldSchema = z.object({
  name: z.string().min(2, 'Field name must be at least 2 characters'),
  crop_type: z.string().min(2, 'Crop type is required'),
  acreage: z.coerce.number().positive('Acreage must be greater than 0'),
  soil_type: z.string().min(2, 'Soil type is required'),
  status: z.enum(['Healthy', 'Warning', 'Critical', 'Under Treatment']).optional().default('Healthy'),
  risk_level: z.enum(['Low', 'Medium', 'High']).optional().default('Low'),
  location: z.string().optional().default('Main Plot'),
  health_score: z.coerce.number().min(0).max(100).optional().default(85.0)
});

export const updateFieldSchema = createFieldSchema.partial();
