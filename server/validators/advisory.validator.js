import { z } from 'zod';

export const createAdvisorySchema = z.object({
  field_id: z.string().uuid().nullable().optional().or(z.literal('')),
  title: z.string().min(3, 'Advisory title must be at least 3 characters'),
  status: z.enum(['Open', 'In Progress', 'Resolved']).optional().default('Open')
});

export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  image_url: z.string().nullable().optional(),
  sender_type: z.enum(['farmer', 'agent', 'ai']).optional().default('farmer')
});
