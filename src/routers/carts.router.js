import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

const cartManager = new CartManager();
const carts = [];

router.post('/', async (req, res) => {
  const productData = req.body;
  const cart = {
    products: [
      {
        product: productData.product,
        quantity: productData.quantity || 1
      }
    ]
  };
  const result = await cartManager.save(cart);
  res.send({ status: 'success', result });
});

router.get('/:id', async (req, res) => {
  const cartId = Number(req.params.id);
  const cart = await cartManager.getById(cartId);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send({ status: 'success', cart });
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(cart => cart.id === cartId);

  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }

  const products = cart.products;

  res.json(products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    let cart = await cartManager.getById(cid);
    if (!cart) {
      cart = {
        id: cid,
        products: []
      };
    }
    for (let i = 0; i < quantity; i++) {
      cart.products.push(pid);
    }
    await cartManager.save(cart);
    res.send({ message: 'Product added to cart', cart: cart });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding product to cart' });
  }
});

router.delete('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find(cart => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const productIndex = cart.products.indexOf(productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found in cart' });
  }

  cart.products.splice(productIndex, 1);

  return res.status(200).json({ message: 'Product removed from cart successfully' });
});

router.put('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }

  cart.products = products;

  res.send('Cart updated successfully');
});

router.put('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }

  const product = cart.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).send({ error: 'Product not found in cart' });
  }

  product.quantity = quantity;

  res.send('Quantity updated successfully');
});

export default router;
