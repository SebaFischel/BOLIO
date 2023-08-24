import { Router } from "express";
import CartManager from '../dao/dbManagers/CartManager.js';
import ProductManager from '../dao/dbManagers/ProductManager.js';
import { logger } from '../utils.js' 
import jwt from 'jsonwebtoken';
import cartModel from "../dao/dbManagers/models/CartModel.js";
import userModel from "../dao/dbManagers/models/UsersModel.js";

import productModel from '../dao/dbManagers/models/ProductModel.js'

const PRIVATE_KEY = 'coder39760';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();
const carts = [];

const getCarts = async (req, res) => {
    const carts = await cartManager.getAll();
    res.send(carts);
  };
//me gusta

const postCart = async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];

      jwt.verify(token, PRIVATE_KEY, async (error, decoded) => {
          if (error) {
              console.log('Token verification error:', error);
              return res.status(403).json({ error: 'Token verification failed' });
          }
          if (decoded && decoded.userId) {
              const userId = decoded.userId;

              let user = await userModel.findById(userId);

              console.log("Verificando usuario...");

              if (!user) {
                  // Si el usuario no existe, créalo
                  user = await userModel.create({ _id: userId, cart: [] });
                  console.log('Nuevo Usuario Creado:', user);
              }

              // 3. Verifique la estructura del objeto req.body
              const newProducts = req.body.products;
              console.log("Productos recibidos:", newProducts);

              let existingCart = null;

              if (user.cart.length > 0) {
                  // Si el usuario ya tiene un carrito, obtén el primer carrito de la lista
                  existingCart = await cartModel.findById(user.cart[0]);
              }

              if (!existingCart) {
                  // Si el usuario no tiene un carrito existente, crea uno nuevo
                  const cart = {
                      products: newProducts,
                  };

                  existingCart = await cartModel.create(cart);
                  console.log('Nuevo Carrito Creado:', existingCart);

                  // Asocia el carrito con el usuario
                  user.cart.push(existingCart._id);
                  await user.save();
                  console.log('Usuario Actualizado con Nuevo Carrito:', user);
              } else {
                  // Verifica si newProducts es un iterable antes de recorrerlo
                  if (Array.isArray(newProducts) && newProducts.length > 0) {
                      // Itera sobre los nuevos productos y agrégalos al carrito existente
                      for (const newProduct of newProducts) {
                          const existingProductIndex = existingCart.products.findIndex(
                              (product) => product.product.toString() === newProduct.product.toString()
                          );

                          if (existingProductIndex !== -1) {
                              // Si el producto ya existe en el carrito, aumenta la cantidad en 1
                              existingCart.products[existingProductIndex].quantity += 1;
                          } else {
                              // Si el producto no existe en el carrito, agrégalo como un nuevo producto
                              existingCart.products.push(newProduct);
                          }
                      }

                      // Calcula el totalPrice del carrito actualizado
                      existingCart.totalPrice = existingCart.products.reduce(
                          (total, product) => total + product.product.price * product.quantity,
                          0
                      );

                      // Guarda el carrito actualizado en la base de datos
                      await existingCart.save();
                      console.log('Carrito Actualizado con Nuevos Productos:', existingCart);
                  }
              }

              // Devuelve el carrito actualizado
              res.send(existingCart);
          } else {
              console.log('Token JWT no contiene el campo userId del usuario');
              return res.status(403).json({ error: 'Token JWT no contiene el campo userId del usuario' });
          }
      });
  } catch (error) {
      console.error("Error en el controlador postCart:", error);
      console.error(error);
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
    const userId = req.session.user._id; // Asegúrate de que esta línea obtenga el ID del usuario correctamente

    try {
        console.log("Inicio del controlador purchaseCart");
        console.log("ID del carrito:", cartId);
        console.log("ID del usuario:", userId);

        // Realiza la compra y guarda el mensaje de éxito o el error
        const message = await cartManager.purchaseCart(cartId, req.session.user.first_name, req.session.user.last_name);

        console.log("Compra exitosa. Eliminando carrito...");

        // Elimina el carrito de la colección de carritos
        await cartModel.findByIdAndDelete(cartId);

        console.log("Carrito eliminado. Actualizando usuario...");

        // Actualiza el array 'cart' en el documento del usuario para eliminar el ID del carrito
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            $pull: { cart: cartId },
        });

        console.log("Usuario actualizado:", updatedUser);

        // Devuelve la respuesta con el mensaje de éxito o el error
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error en el controlador purchaseCart:", error);
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