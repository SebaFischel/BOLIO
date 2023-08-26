import fs from 'fs/promises'; 
import { logger } from '../../utils.js';

const PRODUCTS_FILE_PATH = 'src/Files/Products.json';

export default class Products {
  constructor() {
    logger.info('Working products with FileSystem');
    this.path = PRODUCTS_FILE_PATH;
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

  async save(product) {
    try {
      const products = await this.getAll();
      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }

      products.push(product);

      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');

      return product;
    } catch (error) {
      logger.error(error);
      throw new Error('Error al guardar el producto en el archivo');
    }
  }

  async getProductById(id) {
    const products = await this.getAll();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return 'Product not found';
    }

    return product;
  }

  async deleteProductById(id) {
    try {
      const products = await this.getAll();
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return 'Product not found';
      }

      products.splice(index, 1);

      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');

      return 'Product deleted successfully';
    } catch (error) {
      logger.error(error);
      throw new Error('Error al eliminar el producto del archivo');
    }
  }

  async updateProductById(product) {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === product.id);

    if (index === -1) {
      return 'Product not found';
    }

    products[index] = product;

    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');

    return product;
  }

  async removeProductFromCart(cartId, productId) {
    try {
    } catch (error) {
      logger.error(error);
      throw new Error('Error al eliminar el producto del carrito');
    }
  }
}