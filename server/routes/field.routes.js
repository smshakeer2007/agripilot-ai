import { Router } from 'express';
import { fieldController } from '../controllers/field.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', fieldController.getFields);
router.post('/', fieldController.createField);
router.get('/:id', fieldController.getFieldById);
router.put('/:id', fieldController.updateField);
router.delete('/:id', fieldController.deleteField);

export default router;
