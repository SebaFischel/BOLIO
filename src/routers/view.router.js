import { Router } from 'express';
import { index, realTimeProducts, products, registerView, loginView, productsPrivate } from '../controllers/view.controller.js';

const router = Router();



router.get('/', index)

router.get('/realTimeProducts', realTimeProducts)

router.get('/products', products)

const publicAccess = (req, res, next) => {
  if(req.session.user) return res.redirect('/products');
  next();
}

const privateAccess = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get('/register', publicAccess, registerView)

router.get('/login', publicAccess, loginView)

router.get('/products', privateAccess, productsPrivate)



export default router;