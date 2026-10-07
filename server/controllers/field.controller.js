import { db } from '../db/index.js';
import { createFieldSchema, updateFieldSchema } from '../validators/field.validator.js';

export const fieldController = {
  // GET /api/fields
  async getFields(req, res, next) {
    try {
      const fields = await db.getFieldsByUserId(req.user.id);
      return res.json({
        success: true,
        count: fields.length,
        fields
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/fields/:id
  async getFieldById(req, res, next) {
    try {
      const { id } = req.params;
      const field = await db.getFieldById(id, req.user.id);

      if (!field) {
        return res.status(404).json({
          success: false,
          message: 'Field not found or access denied.'
        });
      }

      // Fetch related advisories for this field
      const allAdvisories = await db.getAdvisoriesByUserId(req.user.id);
      const fieldAdvisories = allAdvisories.filter(a => a.field_id === id);

      return res.json({
        success: true,
        field: {
          ...field,
          advisories: fieldAdvisories
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/fields
  async createField(req, res, next) {
    try {
      const validated = createFieldSchema.parse(req.body);
      const newField = await db.createField({
        ...validated,
        user_id: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: 'Field plot registered successfully.',
        field: newField
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/fields/:id
  async updateField(req, res, next) {
    try {
      const { id } = req.params;
      const validated = updateFieldSchema.parse(req.body);

      const existing = await db.getFieldById(id, req.user.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Field not found or access denied.'
        });
      }

      const updated = await db.updateField(id, req.user.id, validated);
      return res.json({
        success: true,
        message: 'Field updated successfully.',
        field: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/fields/:id
  async deleteField(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await db.deleteField(id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Field not found or already deleted.'
        });
      }

      return res.json({
        success: true,
        message: 'Field removed successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
};
