import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const productModel = new ProductManager();
const cartManager = new CartManager();
const carts = [];

router.get("/", async (req, res) => {
  const carts = await cartManager.getAll();
  res.send(carts);
});

router.post("/", async (req, res) => {
  //const productData = req.body;
  const cart = {
    products: [],
  };
  const result = await cartManager.save(cart);
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const cartId = req.params.id;
  const cart = await cartManager.getById(cartId);
  if (!cart) {
    return res.status(404).send({ error: "Cart not found" });
  }
  res.send(cart);
});

/* router.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  const products = cart.products;

  res.json(products);
});
 */

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    if (updatedCart) {
      res.send(updatedCart);
    } else {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const productIndex = cart.products.indexOf(productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  cart.products.splice(productIndex, 1);

  return res
    .status(200)
    .json({ message: "Product removed from cart successfully" });
});

router.put("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  const cart = carts.find((cart) => cart.id === cartId);
  if (!cart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  cart.products = products;

  res.send("Cart updated successfully");
});

router.put("/:cid/products/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  const cart = carts.find((cart) => cart.id === cartId);
  if (!cart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  const product = cart.products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).send({ error: "Product not found in cart" });
  }

  product.quantity = quantity;

  res.send("Quantity updated successfully");
});

export default router;
