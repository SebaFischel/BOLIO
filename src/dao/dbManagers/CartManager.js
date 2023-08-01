import cartModel from '../dbManagers/models/CartModel.js';
import fs from "fs";
import productModel from '../dbManagers/models/ProductModel.js'
import ticketModel from './models/TicketModel.js';
import { v4 as uuidv4 } from "uuid";
import { logger } from '../../utils.js'


export default class Carts {
  constructor() {
   logger.info("Working carts with DB");
    this.path = "src/Files/carts.json";
  }

  async getAll() {
    const carts = await cartModel.find().lean();
    return carts;
  }

  async save(cart) {
    try {
      const result = await cartModel.create(cart);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error al guardar el carrito en la base de datos");
    }
  }

  async getById(id) {
    const cart = await cartModel.findOne({ _id: id }).lean();
    if (!cart) {
      return "Cart not found";
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return null;
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      logger.error(error);
      throw new Error("Error al agregar el producto al carrito");
    }
  }
  

  async deleteProductCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return "Cart not found";
      }
  
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );
  
      if (existingProductIndex !== -1) {
        const product = cart.products[existingProductIndex];
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          cart.products.splice(existingProductIndex, 1);
        }
        const updatedCart = await cart.save();
        return updatedCart;
      } else {
        return "Product not found in cart";
      }
    } catch (error) {
      logger.error(error);
      throw new Error("Error al eliminar el producto del carrito");
    }
  }

  async readCartsFromFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          try {
            const carts = JSON.parse(data);
            resolve(carts);
          } catch (error) {
            logger.error("Error al analizar el contenido JSON:", error);
            reject(error);
          }
        }
      });
    });
  }
  async writeCartsToFile(carts) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(carts, null, "\t"), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async purchaseCart(cartId) {
    try {
      let total = 0;
      logger.info("Inicio del método purchaseCart"); 

      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const unprocessedProducts = [];

      for (const productItem of cart.products) {
        logger.info(`Procesando producto: ${productItem.product}`); 

        const product = await productModel.findById(productItem.product);
        if (!product) {
          unprocessedProducts.push(productItem.product); 
          continue; 
        }
        
        if (product.stock >= productItem.quantity) {
          
          product.stock -= productItem.quantity;
          await product.save();
        } else {
          unprocessedProducts.push(productItem.product); 
          continue; 
        }
        cart.products.forEach((e) => {
          total += e.quantity;
        });
      }

      await cartModel.findByIdAndDelete(cartId);

      if (unprocessedProducts.length === 0) {
        const fecha = new Date().toLocaleString("en-GB", {
          hour12: false,
        });
        logger.info(typeof(fecha))
        const ticketData = {
          code: uuidv4(),
          purchase_datetime: fecha,
          amount: total,
          purchaser: "Sebastian",
        };

        const ticket = new ticketModel(ticketData);
        await ticket.save();

        logger.info("Finalización exitosa de la compra");
        return "Purchase completed successfully";
      }

      logger.error("Error durante el proceso de compra");
      return {
        error: "Error during the purchase process",
        unprocessedProducts,
      };
    } catch (error) {
      logger.error(error);
      throw new Error("Error during the purchase process");
    }
  }
}