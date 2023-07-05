import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const productManager = new ProductManager('./Files/Products.json');

router.post('/', async (req, res) => {
     const product = {
         title: req.body.title,
         description: req.body.description,
         code: req.body.code,
         price: req.body.price,
         status: req.body.status,
         stock: req.body.stock,
         category: req.body.category,
         thumbnails: req.body.thumbnails,
      };

    if (!product.status){
        product.status = true;
    }

    if(!product.title || !product.description || !product.code || !product.price || !product.category || !product.stock )
    return res.status(400).send ({ error: 'incomplete values'});
    const result = await productManager.save(product)
    res.send({status: 'success', result})
})

router.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.send({status: 'success', products});
})

router.get('/:pid', async (req, res) => {
    try {
        const productId = Number(req.query.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
          res.send(product);
        } 
       
      } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Producto no encontrado'});
      }
    });

router.delete('/:pid', async (req, res) => {
    try {
        const productId = Number(req.query.pid);
        await productManager.deleteProductById(productId);
        res.send({status: 'success'})
              
      } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Producto no encontrado'});
      }
    });

router.put('/:pid', async (req, res) => {
    try {
        const productUpdates = req.body;
        productUpdates.id = Number(req.query.pid)
        
            await productManager.updateProductByID(productUpdates);
            res.send({status: 'success'})  

          } catch (error) {

            console.log(error);
            return res.status(400).send({ error: 'Producto no encontrado'});
          }

});
    

export default router;