import { db } from '../db/index.js';
import { createAdvisorySchema, createMessageSchema } from '../validators/advisory.validator.js';

export const advisoryController = {
  // GET /api/advisories
  async getAdvisories(req, res, next) {
    try {
      const advisories = await db.getAdvisoriesByUserId(req.user.id);
      return res.json({
        success: true,
        count: advisories.length,
        advisories
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/advisories/:id
  async getAdvisoryById(req, res, next) {
    try {
      const { id } = req.params;
      const advisory = await db.getAdvisoryById(id, req.user.id);

      if (!advisory) {
        return res.status(404).json({
          success: false,
          message: 'Advisory consultation not found or access denied.'
        });
      }

      const messages = await db.getMessagesByAdvisoryId(id);
      const analyses = await db.getAiAnalysesByAdvisoryId(id);

      return res.json({
        success: true,
        advisory: {
          ...advisory,
          messages,
          analyses,
          latestAnalysis: analyses.length > 0 ? analyses[analyses.length - 1] : null
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/advisories
  async createAdvisory(req, res, next) {
    try {
      const validated = createAdvisorySchema.parse(req.body);
      
      const newAdvisory = await db.createAdvisory({
        user_id: req.user.id,
        field_id: validated.field_id || null,
        title: validated.title,
        status: validated.status || 'Open'
      });

      return res.status(201).json({
        success: true,
        message: 'Advisory consultation thread initialized.',
        advisory: newAdvisory
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/advisories/:id/messages
  async getMessages(req, res, next) {
    try {
      const { id } = req.params;
      const advisory = await db.getAdvisoryById(id, req.user.id);

      if (!advisory) {
        return res.status(404).json({
          success: false,
          message: 'Advisory thread not found.'
        });
      }

      const messages = await db.getMessagesByAdvisoryId(id);
      return res.json({
        success: true,
        count: messages.length,
        messages
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/advisories/:id/messages
  async createMessage(req, res, next) {
    try {
      const { id } = req.params;
      const advisory = await db.getAdvisoryById(id, req.user.id);

      if (!advisory) {
        return res.status(404).json({
          success: false,
          message: 'Advisory thread not found.'
        });
      }

      const validated = createMessageSchema.parse(req.body);

      const message = await db.createMessage({
        advisory_id: id,
        sender_type: validated.sender_type || 'farmer',
        content: validated.content,
        image_url: validated.image_url || null
      });

      return res.status(201).json({
        success: true,
        message: 'Message sent.',
        data: message
      });
    } catch (err) {
      next(err);
    }
  }
};
