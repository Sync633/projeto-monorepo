import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Rota Pública de Login
router.post('/login', AuthController.login);

export { router as authRoutes };
