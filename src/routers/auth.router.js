import { Router } from 'express';
import { authToken } from '../utils.js';
import { jwtRegister, jwtLogin, jwtCurrent } from '../controllers/auth.controller.js'

const router = Router();

router.post('/register', jwtRegister)

router.post('/login', jwtLogin)

router.get('/current' , authToken, jwtCurrent)
export default router; 