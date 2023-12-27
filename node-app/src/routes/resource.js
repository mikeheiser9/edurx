import express from 'express';
import ResourceController from '../controllers/resource.js';
import { addResourceValidator, validateIds } from '../middleware/validator/resource.js';

const router = express.Router();

router.get('/resources', ResourceController.getResources);
router.post('/create', addResourceValidator, ResourceController.createResource);
router.delete('/delete', ResourceController.deleteResourceById);

export default router;