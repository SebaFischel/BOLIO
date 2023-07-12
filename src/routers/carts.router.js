import { Router } from "express";
import { getCarts, postCart, getId, postIntoCart, deleteProductFromCart, updateCart, updateProductsToCart } from '../controllers/carts.controller.js'

const router = Router();


router.get("/", getCarts)

router.post("/", postCart)

router.get("/:id", getId)

router.post("/:cid/product/:pid", postIntoCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCart)

router.put("/:cid/products/:pid", updateProductsToCart)

export default router;
