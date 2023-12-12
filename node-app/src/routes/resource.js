import express from 'express';
import ResourceController from '../controllers/resource.js';
import { addResourceValidator, validateIds } from '../middleware/validator/resource.js';

const router = express.Router();

router.get('/', ResourceController.getResources);
router.post('/create', addResourceValidator, ResourceController.createResource);

export default router;