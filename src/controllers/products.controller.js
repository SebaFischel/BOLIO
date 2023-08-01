import { Router } from "express";
import ProductManager from '../dao/dbManagers/ProductManager.js'
import { logger } from "../utils.js";

const productManager = new ProductManager('../dao/dbManagers/ProductManager.js')


const router = Router();

const postProduct = async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } = req.body;

  
  let PastTests = 0;
  const TotalTests = 2;

  if (!title || !description || !price || !code || !stock || !category) {
    let missingProperties = [];

    if (!title) missingProperties.push('title');
    if (!description) missingProperties.push('description');
    if (!price) missingProperties.push('price');
    if (!code) missingProperties.push('code');
    if (!stock) missingProperties.push('stock');
    if (!category) missingProperties.push('category');

    logger.error(`Test 1: Incorrecto. Faltan las siguientes propiedades: ${missingProperties.join(', ')}`);
    return res.status(400).send({ status: "error", error: `Faltan las siguientes propiedades: ${missingProperties.join(', ')}` });
  } else {
    PastTests++;
    logger.info('Test 1: Correcto');
  }
  try {
    const product = {
      title: title,
      description: description,
      price: price,
      code: code,
      stock: stock,
      category: category,
      status: true,
    };

    const result = await productManager.save(product);
    logger.info('Test 2: Correcto');
    PastTests++;
    res.send({ status: "success", result });
  } catch (error) {
    logger.error(`Test 2: Incorrecto. Error al guardar el producto: ${error.message}`);
    res.status(500).send({ status: "error", error: `Error al guardar el producto: ${error.message}` });
  }

  logger.info(`Tests Pasados: ${PastTests} / Total Tests: ${TotalTests}`);
};

  const getProducts = async (req, res) => {
    const products = await productManager.getAll();
    res.send({ status: "success", products });
  };

  const getPid = async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.getProductById(productId);
      if (product) {
        res.send({ status: product });
      } else {
        return res.status(404).send({ error: "Producto no encontrado" });
      }
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);
      return res
        .status(500)
        .send({ error: "Error en el servidor", detailedError: error.message });
    }
  };

  const deletePid = async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.deleteProductById(productId);
      res.send({ status: product });
    } catch (error) {
      logger.error(error);
      return res.status(400).send({ error: "Producto no encontrado" });
    }
  };

  const updatePid = async (req, res) => {
    try {
      const productUpdates = req.body;
      productUpdates.id = req.params.pid;
  
      await productManager.updateProductById(productUpdates);
      res.send({ status: "success" });
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Error en el servidor", detailedError: error.message });
    }
  };

  export default router;

  export {
    postProduct,
    getProducts,
    getPid,
    deletePid,
    updatePid
  }