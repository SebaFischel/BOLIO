import productModel from '../dbManagers/models/ProductModel.js'
import CartManager from "../dbManagers/CartManager.js"
import { logger } from '../../utils.js'


const cartManager = new CartManager();

export default class Products {
  constructor() {
    logger.info("Working products with DB");
    this.path = "src/Files/Products.json";
  }

  async getAll() {
    const products = await productModel.find().lean();
    return products;
  }

  async save(product) {
    const products = await this.getAll();
    if (products.length === 0) {
      product.id = 1;
    } else {
      product.id = products[products.length - 1].id + 1;
    }

    await productModel.create(product);
    return product;
  }

  async getProductById(id) {
    const product = await productModel.findOne({ _id: id }).lean();
    if (!product) {
      return "Product not found";
    } else {
      return product;
    }
  }

  async deleteProductById(id) {
    const product = await productModel.findOneAndDelete({ _id: id }).lean();
    if (!product) {
      return "Product not found";
    } else {
      return "Product deleted successfully";
    }
  }

  async updateProductById(product) {
    const producto = await productModel.findOne({ _id: product.id });
    if (!producto) {
      return "Product not found";
    } else {
      const updatedProduct = await productModel
        .findOneAndUpdate({ _id: product.id }, product, { new: true })
        .lean();
      if (!updatedProduct) {
        return "Product not found";
      } else {
        return updatedProduct;
      }
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartManager.getById(cartId);
      if (!cart) {
        return null;
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );

      if (existingProductIndex !== -1) {
        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          cart.products.splice(existingProductIndex, 1);
        }

        const updatedCart = await cartManager.save();
        return updatedCart;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(error);
      throw new Error("Error al eliminar el producto del carrito");
    }
  }
}
