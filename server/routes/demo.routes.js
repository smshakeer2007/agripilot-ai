import { Router } from 'express';
import { demoController } from '../controllers/demo.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.post('/seed', demoController.seedDemo);

export default router;
