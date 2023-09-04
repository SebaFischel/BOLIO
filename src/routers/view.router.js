import { Router } from 'express';
import { index, realTimeProducts, products, registerView, loginView, viewCart, users } from '../controllers/view.controller.js';
import { isAdmin } from '../utils.js';
import { authenticateUser } from '../controllers/sessions.controller.js';

const router = Router();

const publicAccess = (req, res, next) => {
  if(req.session.user) return res.redirect('/products');
  next();
}

const privateAccess = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get('/chat', index)

router.get('/realTimeProducts', realTimeProducts)

router.get('/products', privateAccess ,products)

router.get('/register', publicAccess,registerView)

router.get('/login', publicAccess, loginView)

router.get('/cart', privateAccess, viewCart)

router.get('/users', authenticateUser, isAdmin, users)



export default router;