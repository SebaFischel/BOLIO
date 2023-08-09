import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser, loginGithub, loginCallback, authenticateUser, getCurrentUser } from '../controllers/sessions.controller.js'

const router = Router();


router.post('/register', registerUser)


router.post('/login', loginUser)

router.get('/current',authenticateUser, getCurrentUser)

router.get('/logout', logoutUser)

router.get('/github',passport.authenticate(
    'github', { scope: ['user:email'] }
  ), loginGithub)

router.get('/github-callback', passport.authenticate(
    'github', { failureRedirect: '/login' }
  ), loginCallback)

export default router;