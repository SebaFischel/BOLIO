import { Router } from 'express';
import { generateMockProduct } from '../utils.js'


const router = Router();

const mockingProducts = (req, res) => {
    const products = generateMockProduct(100);
    res.json(products);
  };

export default router;

export {
    mockingProducts
}