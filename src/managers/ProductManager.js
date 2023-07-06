import productModel from "../models/ProductModel.js";

export default class Products {
  constructor() {
    console.log("Working products with DB");
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
}
