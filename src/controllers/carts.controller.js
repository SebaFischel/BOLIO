import { Router } from "express";
import CartManager from '../dao/dbManagers/CartManager.js';
import ProductManager from '../dao/dbManagers/ProductManager.js';
import { logger } from '../utils.js' 
import productModel from '../dao/dbManagers/models/ProductModel.js'



const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();
const carts = [];

const getCarts = async (req, res) => {
    const carts = await cartManager.getAll();
    res.send(carts);
  };

  const postCart = async (req, res) => {
    //const productData = req.body;
    const cart = {
      products: [],
    };
    const result = await cartManager.save(cart);
    res.send(result);
  };

  const getId = async (req, res) => {
    const cartId = req.params.id;
    const cart = await cartManager.getById(cartId);
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }
  res.send (cart);
};

  const postIntoCart = async (req, res) => {
    try {
      let PastTests = 0;
      const TotalTests = 2;
  
      const cartId = req.params.cid;
      const productId = req.params.pid;
  
      const product = await productManager.getProductById(productId);
      if (!product) {
        PastTests++;
        logger.warning("Test 1: Incorrecto. Producto no encontrado");
        return res.status(404).send({ error: "Producto no encontrado" });
      } else {
        PastTests++;
        logger.info("Test 1: Correcto");
      }
  
      const updatedCart = await cartManager.addProductToCart(cartId, productId);
      if (updatedCart) {
        PastTests++;
        logger.info("Test 2: Correcto");
        res.send(updatedCart);
      } else {
        logger.warning("Test 2: Incorrecto. Carrito no encontrado");
        return res.status(404).send({ error: "Carrito no encontrado" });
      }
  
      logger.info(`Tests Pasados: ${PastTests} / Total Tests: ${TotalTests}`);
    } catch (error) {
      logger.fatal(error);
      return res.status(500).send({ error: error.message });
    }
  };

  const deleteProductFromCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
  
      const updatedCart = await cartManager.deleteProductCart(cartId, productId);
      if (typeof updatedCart === "string") {
        if (updatedCart === "Cart not found") {
          res.status(404).json({ error: 'El carrito no existe' });
        } else if (updatedCart === "Product not found in cart") {
          res.status(404).json({ error: 'El producto no existe en el carrito' });
        }
      } else {
        res.status(200).json(updatedCart);
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
  };
  

  const updateCart = (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;
  
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }
  
    cart.products = products;
  
    res.send("Cart updated successfully");
  };

  const updateProductsToCart = (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
  
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }
  
    const product = cart.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found in cart" });
    }
  
    product.quantity = quantity;
  
    res.send("Quantity updated successfully");
  };

  const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const message = await cartManager.purchaseCart(cartId);
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error during the purchase process' });
    }
  };



  export default router;

  export {
  getCarts,
  postCart,
  getId,
  postIntoCart, 
  deleteProductFromCart,
  updateCart,
  updateProductsToCart,
  purchaseCart,

}