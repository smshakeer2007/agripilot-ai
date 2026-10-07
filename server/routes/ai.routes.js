import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/analyze', aiController.analyzeCrop);
router.post('/diagnose-image', aiController.diagnoseImage);
router.post('/generate-insights', aiController.generateInsights);

export default router;
