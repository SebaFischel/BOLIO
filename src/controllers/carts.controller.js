import { Router } from "express";
import CartManager from '../dao/dbManagers/CartManager.js';
import ProductManager from '../dao/dbManagers/ProductManager.js';
import { logger } from '../utils.js' 
import jwt from 'jsonwebtoken';
import cartModel from "../dao/dbManagers/models/CartModel.js";
import userModel from "../dao/dbManagers/models/UsersModel.js";

const PRIVATE_KEY = 'coder39760';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();
const carts = [];

const getCarts = async (req, res) => {
    const carts = await cartManager.getAll();
    res.send(carts);
  };

  const createCart = async (req, res) => {
    try {
      const emptyCart = await cartModel.create({ products: [] });
  
      res.status(201).json(emptyCart);
    } catch (error) {
      logger.error("Error en la función createCart:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  const postCart = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      jwt.verify(token, PRIVATE_KEY, async (error, decoded) => {
        if (error) {
          logger.error('Token verification error:', error);
          return res.status(403).json({ error: 'Token verification failed' });
        }
  
        if (decoded && decoded.userId) {
          const userId = decoded.userId;
  
          let user = await userModel.findById(userId);
  
          logger.info("Verificando usuario...");
  
          if (!user) {
            user = await userModel.create({ _id: userId, cart: [] });
            logger.info('Nuevo Usuario Creado:', user);
          }
  
          const newProducts = req.body.products;
          logger.info("Productos recibidos:", newProducts);
  
          let existingCart = null;
  
          if (user.cart.length > 0) {
            existingCart = await cartModel.findById(user.cart[0]);
          }
  
          if (!existingCart) {
            const cart = {
              products: newProducts,
            };
  
            existingCart = await cartModel.create(cart);
            logger.info('Nuevo Carrito Creado:', existingCart);
            user.cart.push(existingCart._id);
            await user.save();
            logger.info('Usuario Actualizado con Nuevo Carrito:', user);
  
            req.session.user = user;
          } else {
            if (Array.isArray(newProducts) && newProducts.length > 0) {
              for (const newProduct of newProducts) {
                const existingProductIndex = existingCart.products.findIndex(
                  (product) => product.product.toString() === newProduct.product.toString()
                );
  
                if (existingProductIndex !== -1) {
                  existingCart.products[existingProductIndex].quantity += 1;
                } else {
                  existingCart.products.push(newProduct);
                }
              }
  
              existingCart.totalPrice = existingCart.products.reduce(
                (total, product) => total + product.product.price * product.quantity,
                0
              );
  
              await existingCart.save();
              logger.info('Carrito Actualizado con Nuevos Productos:', existingCart);
            }

            req.session.user = user;
          }
  
          res.send(existingCart);
        } else {
          logger.error('Token JWT no contiene el campo userId del usuario');
          return res.status(403).json({ error: 'Token JWT no contiene el campo userId del usuario' });
        }
      });
    } catch (error) {
      logger.error("Error en el controlador postCart:", error);
      logger.error(error);
      res.status(401).send('Token JWT inválido o expirado');
    }
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

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);

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
    const userId = req.session.user._id;

    try {
        logger.info("Inicio del controlador purchaseCart");
        logger.info("ID del carrito:", cartId);
        logger.info("ID del usuario:", userId);

        const message = await cartManager.purchaseCart(cartId, req.session.user.first_name, req.session.user.last_name, req.session.user.email);

        logger.info("Compra exitosa. Eliminando carrito...");

        await cartModel.findByIdAndDelete(cartId);

        logger.info("Carrito eliminado. Actualizando usuario...");

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            $pull: { cart: cartId },
        });

        logger.info("Usuario actualizado:", updatedUser);

        res.status(200).json({ message });
    } catch (error) {
        logger.error("Error en el controlador purchaseCart:", error);
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
  createCart,

}