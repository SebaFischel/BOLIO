import { Router } from 'express';
import ProductManager from '../dao/dbManagers/ProductManager.js';
import productModel from '../dao/dbManagers/models/ProductModel.js';
import CartManager from '../dao/dbManagers/CartManager.js'
import { logger } from '../utils.js'

const cartManager = new CartManager();
const router = Router();
const productManager = new ProductManager();

const index = (req, res) => {
    res.render('index');
  };

  const realTimeProducts = async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', { products })
  };
  
  const products = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const {
      docs,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage
    } = await productModel.paginate({}, { limit, page, lean: true});
    
    const products = docs;
    
    res.render('products',{
      products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage
    });
  };

  const registerView = (req, res) => {
    res.render('register');
  };

  const loginView = (req, res) => {
    res.render('login');
  };

  const productsPrivate = (req, res) => {
    res.render('products', {
         user: req.session.user
     });
   };

   const viewCart = async (req, res) => {
    try {
        const userData = req.session.user;
        const userCartIds = userData.cart;

        const userCarts = await Promise.all(userCartIds.map(async (cartId) => {
            const cart = await cartManager.getById(cartId);

            if (cart && cart.products) { 
                cart.products.forEach((product) => {
                    product.totalPrice = product.product.price * product.quantity;
                });

                cart.totalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
            }

            return cart;
        }));
        
        res.render('cart', { user: userData, userCarts });
    } catch (error) {
        logger.error('Error:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};


  export default router;

  export {
    loginView,
    registerView,
    productsPrivate,
    products,
    realTimeProducts,
    index,
    viewCart
  }

