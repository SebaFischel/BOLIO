import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils.js';

const CARTS_FILE_PATH = 'src/Files/carts.json';

export default class CartsManager {
  constructor() {
    logger.info('Working carts with FileSystem');
    this.path = CARTS_FILE_PATH;
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

  async save(cart) {
    try {
      const carts = await this.getAll();
      cart._id = uuidv4();
      carts.push(cart);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

      return cart;
    } catch (error) {
      logger.error(error);
      throw new Error('Error al guardar el carrito en el archivo');
    }
  }

  async getById(id) {
    const carts = await this.getAll();
    const cart = carts.find((c) => c._id === id);

    if (!cart) {
      return 'Cart not found';
    }

    return cart;
  }

  async deleteById(id) {
    try {
      const carts = await this.getAll();
      const index = carts.findIndex((c) => c._id === id);

      if (index === -1) {
        return 'Cart not found';
      }

      carts.splice(index, 1);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

      return 'Cart deleted successfully';
    } catch (error) {
      logger.error(error);
      throw new Error('Error al eliminar el carrito del archivo');
    }
  }

  async update(cart) {
    try {
      const carts = await this.getAll();
      const index = carts.findIndex((c) => c._id === cart._id);

      if (index === -1) {
        return 'Cart not found';
      }

      carts[index] = cart;

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

      return cart;
    } catch (error) {
      logger.error(error);
      throw new Error('Error al actualizar el carrito en el archivo');
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((c) => c._id === cartId);

      if (!cart) {
        return 'Cart not found';
      }

      const existingProductIndex = cart.products.findIndex((product) => product.product === productId);

      if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += quantity;
      } else {

        cart.products.push({ product: productId, quantity });
      }

      await this.update(cart);

      return cart;
    } catch (error) {
      logger.error(error);
      throw new Error('Error al agregar el producto al carrito');
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((c) => c._id === cartId);

      if (!cart) {
        return 'Cart not found';
      }


      const existingProductIndex = cart.products.findIndex((product) => product.product === productId);

      if (existingProductIndex !== -1) {
        cart.products.splice(existingProductIndex, 1);

        await this.update(cart);

        return cart;
      } else {
        return 'Product not found in cart';
      }
    } catch (error) {
      logger.error(error);
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

}