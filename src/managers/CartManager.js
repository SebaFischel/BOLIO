import cartModel from "../models/CartModel.js";
import fs from "fs";

export default class Carts {
  constructor() {
    console.log("Working carts with DB");
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
      console.error(error);
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
      console.error(error);
      throw new Error("Error al agregar el producto al carrito");
    }
  }
  

  async deleteProductCart(id) {
    const carts = await this.readCartsFromFile();
    const cartIndex = carts.findIndex((cart) => cart.id === id);
    if (cartIndex === -1) {
      return "Cart not found";
    } else {
      carts.splice(cartIndex, 1);
      await this.writeCartsToFile(carts);
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
            console.error("Error al analizar el contenido JSON:", error);
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
}
