import { Router } from 'express';
import { generateMockProduct } from '../utils.js'
import productModel from '../dao/dbManagers/models/ProductModel.js'
import { logger } from '../utils.js'


const router = Router();

const mockingProducts = async (req, res) => {
  try {
    const products = generateMockProduct(10);

    await productModel.insertMany(products);

    res.json({ message: 'Productos guardados en la base de datos' });
  } catch (error) {
    logger.error(error)
    res.status(500).json({ error: 'Error al guardar los productos en la base de datos' });
  }
};

export default router;

export {
    mockingProducts
}