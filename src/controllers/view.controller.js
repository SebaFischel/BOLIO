import { Router } from 'express';
import ProductManager from '../dao/dbManagers/ProductManager.js';
import productModel from '../dao/dbManagers/models/ProductModel.js';
import CartManager from '../dao/dbManagers/CartManager.js'

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

   const  viewCart = async (req, res) => {
    try {
      const id = req.params.id
      const cart = await cartManager.getById(id)
      console.log(id)
      const products = cart.products.map(prod => {
        return {
            _id: prod.product._id,
             quantity: prod.quantity
        } 
      }) 
      res.render('cart' ,
      {
        title: "Carrito De Compras",
        cid,
        products
      });
    } catch (err) {
      console.log(err)
        }

    }

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

