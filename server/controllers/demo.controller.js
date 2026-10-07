import { seedDemoDataForUser } from '../db/seed.js';

export const demoController = {
  // POST /api/demo/seed
  async seedDemo(req, res, next) {
    try {
      const result = await seedDemoDataForUser(req.user.id);
      return res.json({
        success: true,
        message: 'Demo farm data seeded successfully! 5 fields, diagnostics, and AI insights loaded.',
        result
      });
    } catch (err) {
      next(err);
    }
  }
};
