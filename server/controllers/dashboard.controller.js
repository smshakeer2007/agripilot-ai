import { db } from '../db/index.js';

export const dashboardController = {
  // GET /api/dashboard/stats
  async getStats(req, res, next) {
    try {
      const analytics = await db.getDashboardAnalytics(req.user.id);
      return res.json({
        success: true,
        data: analytics
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/dashboard/diseases
  async getDiseases(req, res, next) {
    try {
      const analytics = await db.getDashboardAnalytics(req.user.id);
      return res.json({
        success: true,
        data: analytics.diseaseDistribution
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/dashboard/categories
  async getCategories(req, res, next) {
    try {
      const analytics = await db.getDashboardAnalytics(req.user.id);
      return res.json({
        success: true,
        data: analytics.categoryDistribution
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/dashboard/priorities
  async getPriorities(req, res, next) {
    try {
      const analytics = await db.getDashboardAnalytics(req.user.id);
      return res.json({
        success: true,
        data: analytics.priorityDistribution
      });
    } catch (err) {
      next(err);
    }
  }
};
