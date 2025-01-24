import {Router} from 'express';
import { signup, login, logout } from '../controllers/auth/index.js'
import verifyJWT from '../middlewares/verifyJWT.middleware.js'

const router = Router();

// un-secured routes
router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(verifyJWT, logout)

export {router}