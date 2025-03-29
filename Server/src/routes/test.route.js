import { Router } from 'express';
import { checkHealth } from '../controllers/test/index.js'
const router = Router();

// * Test public endpoint
router.route('/health').get(checkHealth);

export { router };