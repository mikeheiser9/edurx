import express from 'express';
import ResourceController from '../controllers/resource.js';
import { addResourceValidator, validateIds } from '../middleware/validator/resource.js';

const router = express.Router();

router.get('/', ResourceController.getResources);
router.post('/', addResourceValidator, ResourceController.createResource);
router.put('/user/:userId/saveResource', validateIds, ResourceController.saveResource);
router.delete('/user/:userId/unsaveResource', validateIds, ResourceController.unsaveResource);

export default router;

 