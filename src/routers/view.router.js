import { Router } from 'express';
import { index, realTimeProducts, products, registerView, loginView, productsPrivate } from '../controllers/view.controller.js';

const router = Router();

const publicAccess = (req, res, next) => {
  if(req.session.user) return res.redirect('/products');
  next();
}

const privateAccess = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get('/', index)

router.get('/realTimeProducts', realTimeProducts)

router.get('/products', publicAccess , products)


router.get('/register', publicAccess, registerView)

router.get('/login', publicAccess, loginView)

router.get('/productsPrivate', privateAccess, productsPrivate)



export default router;