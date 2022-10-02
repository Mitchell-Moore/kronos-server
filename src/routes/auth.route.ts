import express from 'express';
import * as AuthController from '../controllers/auth.controller';
const router = express.Router();

router.get('/logout', AuthController.logout);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
