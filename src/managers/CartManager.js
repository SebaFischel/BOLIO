import cartModel from '../models/CartModel.js';
import fs from 'fs';

export default class Carts {
  constructor() {
    console.log('Working carts with DB');
    this.path = 'src/Files/carts.json';
  }

  async getAll() {
    const carts = await cartModel.find().lean();
    return carts;
  }

  async save(cart) {
    const result = await cartModel.create(cart);

    const carts = await this.readCartsFromFile();
    if (carts.length === 0) {
      cart.id = 1;
    } else {
      cart.id = carts[carts.length - 1].id + 1;
    }

    carts.push(cart);
    await this.writeCartsToFile(carts);
    return result;
  }

  async getById(id) {
    const cart = await cartModel.findOne({ id }).lean();
    return cart;
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
