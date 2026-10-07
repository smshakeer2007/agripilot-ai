import { Router } from 'express';
import { advisoryController } from '../controllers/advisory.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', advisoryController.getAdvisories);
router.post('/', advisoryController.createAdvisory);
router.get('/:id', advisoryController.getAdvisoryById);
router.get('/:id/messages', advisoryController.getMessages);
router.post('/:id/messages', advisoryController.createMessage);

export default router;
