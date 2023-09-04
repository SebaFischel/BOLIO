import { Router } from "express";
import { getCarts, postCart, getId, postIntoCart, deleteProductFromCart, updateCart, updateProductsToCart, purchaseCart, createCart} from '../controllers/carts.controller.js'
import { authenticateUser } from '../controllers/sessions.controller.js'
const router = Router();


router.get("/", getCarts)

router.post("/", authenticateUser, postCart)

router.get("/:id", getId)

router.post("/:cid/product/:pid", postIntoCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCart)

router.put("/:cid/products/:pid", updateProductsToCart)

router.post("/:cid/purchase", purchaseCart)

router.post('/create', createCart);




export default router;
