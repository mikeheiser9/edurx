import express from 'express';
import ResourceController, { getResources } from '../controllers/resource.js';
import { addResourceValidator, validateIds } from '../middleware/validator/resource.js';

const router = express.Router();

router.get('/resources', getResources);
router.post('/create', addResourceValidator, ResourceController.createResource);

export default router;