import { Router } from 'express';
import { index, realTimeProducts, products, registerView, loginView, productsPrivate, viewCart } from '../controllers/view.controller.js';
 import { authToken } from '../utils.js';

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

// router.get('/productsPrivate', privateAccess, productsPrivate)

router.get('/cart', privateAccess, viewCart)



export default router;