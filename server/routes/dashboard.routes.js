import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/stats', dashboardController.getStats);
router.get('/diseases', dashboardController.getDiseases);
router.get('/categories', dashboardController.getCategories);
router.get('/priorities', dashboardController.getPriorities);

export default router;
