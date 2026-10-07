import { z } from 'zod';

export const aiAnalyzeRequestSchema = z.object({
  advisory_id: z.string().optional(),
  field_id: z.string().nullable().optional(),
  query: z.string().min(3, 'Query or symptoms description must be at least 3 characters'),
  image_data: z.string().nullable().optional(), // Base64 or image URL
  crop_type: z.string().optional(),
  soil_type: z.string().optional(),
  weather_context: z.string().optional(),
  farming_approach: z.string().optional()
});

export const aiDiagnosticOutputSchema = z.object({
  category: z.string().min(1),
  diagnosis: z.string().min(1),
  confidence_score: z.number().min(0).max(1),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).or(z.string()),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).or(z.string()),
  risk_level: z.enum(['Low', 'Medium', 'High', 'Critical']).or(z.string()),
  summary: z.string().min(5),
  organic_remedy: z.string().min(5),
  chemical_remedy: z.string().min(5),
  recommended_action: z.string().min(5)
});

export const aiTreatmentPlanOutputSchema = z.object({
  response: z.string(),
  approach: z.string(),
  next_step: z.string()
});

export const aiAdvisorySummaryOutputSchema = z.object({
  summary: z.string(),
  main_issue: z.string(),
  expectation: z.string(),
  recommended_next_step: z.string()
});

export const aiFarmInsightsOutputSchema = z.object({
  insights: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.string(),
    recommended_action: z.string()
  }))
});
