import { db } from '../db/index.js';
import { aiService } from '../services/ai.service.js';
import { aiAnalyzeRequestSchema } from '../validators/ai.validator.js';

export const aiController = {
  // POST /api/ai/analyze
  async analyzeCrop(req, res, next) {
    try {
      const payload = aiAnalyzeRequestSchema.parse(req.body);
      let { advisory_id, field_id, query, image_data, crop_type, soil_type, weather_context } = payload;

      let field = null;
      if (field_id) {
        field = await db.getFieldById(field_id, req.user.id);
        if (field) {
          crop_type = crop_type || field.crop_type;
          soil_type = soil_type || field.soil_type;
        }
      }

      // 1. Ensure Advisory exists or create a new one
      let advisory = null;
      if (advisory_id) {
        advisory = await db.getAdvisoryById(advisory_id, req.user.id);
      }

      if (!advisory) {
        const titleSnippet = query.length > 50 ? query.substring(0, 47) + '...' : query;
        advisory = await db.createAdvisory({
          user_id: req.user.id,
          field_id: field_id || null,
          title: `Consultation: ${titleSnippet}`,
          status: 'In Progress'
        });
        advisory_id = advisory.id;
      }

      // 2. Save Farmer's Query as Message
      const farmerMsg = await db.createMessage({
        advisory_id: advisory.id,
        sender_type: 'farmer',
        content: query,
        image_url: image_data ? (image_data.startsWith('http') ? image_data : image_data) : null
      });

      // 3. Perform AI Agronomic Analysis
      const analysisResult = await aiService.diagnoseCrop({
        query,
        imageData: image_data,
        cropType: crop_type || 'General Crop',
        soilType: soil_type || 'Loamy',
        weatherContext: weather_context,
        farmingApproach: req.user.farming_approach
      });

      // 4. Save AI Analysis into Database
      const savedAnalysis = await db.createAiAnalysis({
        advisory_id: advisory.id,
        message_id: farmerMsg.id,
        category: analysisResult.category,
        diagnosis: analysisResult.diagnosis,
        confidence_score: analysisResult.confidence_score,
        severity: analysisResult.severity,
        priority: analysisResult.priority,
        risk_level: analysisResult.risk_level,
        summary: analysisResult.summary,
        organic_remedy: analysisResult.organic_remedy,
        chemical_remedy: analysisResult.chemical_remedy,
        recommended_action: analysisResult.recommended_action
      });

      // 5. Save AI's response message in thread
      await db.createMessage({
        advisory_id: advisory.id,
        sender_type: 'ai',
        content: `Diagnostic complete: ${analysisResult.diagnosis} detected with ${Math.round(analysisResult.confidence_score * 100)}% confidence.\n\nSummary: ${analysisResult.summary}\n\nPriority: ${analysisResult.priority}. Recommended Action: ${analysisResult.recommended_action}`
      });

      // 6. Update Field Status/Risk if attached to field
      if (field_id && field) {
        const newStatus = analysisResult.severity === 'Critical' 
          ? 'Critical' 
          : (analysisResult.severity === 'High' ? 'Warning' : 'Healthy');
        const newRisk = analysisResult.risk_level === 'High' 
          ? 'High' 
          : (analysisResult.risk_level === 'Medium' ? 'Medium' : 'Low');
        
        await db.updateField(field_id, req.user.id, {
          status: newStatus,
          risk_level: newRisk,
          health_score: analysisResult.severity === 'Critical' ? 45.0 : (analysisResult.severity === 'High' ? 65.0 : 88.0)
        });
      }

      return res.json({
        success: true,
        advisory_id: advisory.id,
        message_id: farmerMsg.id,
        analysis: savedAnalysis
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/ai/diagnose-image
  async diagnoseImage(req, res, next) {
    try {
      const { image_data, query = 'Please diagnose the health status of this leaf sample.', crop_type, field_id } = req.body;

      if (!image_data) {
        return res.status(400).json({
          success: false,
          message: 'Image data is required for leaf photo diagnosis.'
        });
      }

      req.body = {
        image_data,
        query,
        crop_type: crop_type || 'Crop Sample',
        field_id: field_id || null
      };

      return aiController.analyzeCrop(req, res, next);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/ai/generate-insights
  async generateInsights(req, res, next) {
    try {
      const fields = await db.getFieldsByUserId(req.user.id);
      const advisories = await db.getAdvisoriesByUserId(req.user.id);

      const generated = await aiService.generateFarmInsights({ fields, advisories });

      // Save generated insights into DB
      const savedInsights = [];
      for (const item of generated.insights) {
        const ins = await db.createInsight({
          user_id: req.user.id,
          title: item.title,
          description: item.description,
          insight_type: 'AI Yield & Risk Advisory',
          severity: item.severity,
          recommended_action: item.recommended_action
        });
        savedInsights.push(ins);
      }

      return res.json({
        success: true,
        message: 'Farm insights generated successfully.',
        insights: savedInsights
      });
    } catch (err) {
      next(err);
    }
  }
};
