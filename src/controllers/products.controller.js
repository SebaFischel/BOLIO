import { Router } from "express";
import ProductManager from '../dao/dbManagers/ProductManager.js'
import { logger } from "../utils.js";
import userModel from "../dao/dbManagers/models/UsersModel.js";
import productModel from "../dao/dbManagers/models/ProductModel.js";
import { transporter } from "./mailSms.controller.js";

const productManager = new ProductManager('../dao/dbManagers/ProductManager.js')


const router = Router();

const postProduct = async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } = req.body;

  try {

    const currentUser = req.session.user;

    let ownerId;

    if (currentUser.role === 'premium' || currentUser.role === 'admin') {
      ownerId = currentUser._id;
    } else if (currentUser.role === 'user') {

      const adminUser = await userModel.findOne({ role: 'admin' });
      ownerId = adminUser._id;
    }

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

    const product = {
      title: title,
      description: description,
      price: price,
      code: code,
      stock: stock,
      category: category,
      status: true,
      owner: ownerId, 
    };

    const result = await productModel.create(product); 
    logger.info('Test 2: Correcto');
    PastTests++;
    res.send({ status: "success", result });

    logger.info(`Tests Pasados: ${PastTests} / Total Tests: ${TotalTests}`);
  } catch (error) {
    logger.error(`Test 2: Incorrecto. Error al guardar el producto: ${error.message}`);
    res.status(500).send({ status: "error", error: `Error al guardar el producto: ${error.message}` });
  }
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
      const userId = req.session.user._id; 
  
      logger.info("User ID:", userId); 
  
      const user = await userModel.findById(userId);
  
      logger.info("User:", user); 
  
      if (!user) {
        logger.info("Usuario no encontrado"); 
        return res.status(404).send({ error: "Usuario no encontrado" });
      }
  
      logger.info("Rol del usuario:", user.role); 
  
      if (user.role === "premium") {

        const product = await productManager.getProductById(productId);

        if (!product) {
          return res.status(404).send({ error: "Producto no encontrado" });
        }
  
        const mailOptions = {
          from: 'fischel.sebastian@gmail.com',
          to: user.email,
          subject: 'Detalles de eliminación del producto',
          text: `El producto "${product.title}" ha sido eliminado con éxito. Descripción: ${product.description}, Precio: ${product.price}, Categoría: ${product.category}, Stock: ${product.stock}`
        };
  
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            logger.error("Error al enviar el correo electrónico:", error);
            return res.status(500).send({ error: "Error al enviar el correo electrónico" });
          } else {
            logger.info("Correo electrónico enviado con éxito");
  
            const deletedProduct = await productManager.deleteProductById(productId);
            res.send({ status: deletedProduct });
          }
        });
      } else {
        const deletedProduct = await productManager.deleteProductById(productId);
        logger.info("Producto eliminado:", deletedProduct);
        res.send({ status: deletedProduct });
      }
    } catch (error) {
      logger.info("Error general:", error); 
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