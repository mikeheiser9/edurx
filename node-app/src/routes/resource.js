import express from 'express';
import ResourceController, { getResources } from '../controllers/resource.js';
import { addResourceValidator, validateIds } from '../middleware/validator/resource.js';
import { userAuth } from '../middleware/passport/userAuth.js';

const router = express.Router();

router.get('/resources',userAuth, getResources);
router.post('/create', addResourceValidator, ResourceController.createResource);

export default router;