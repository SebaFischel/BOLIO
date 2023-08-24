import { Router } from "express";
import { getCarts, postCart, getId, postIntoCart, deleteProductFromCart, updateCart, updateProductsToCart, purchaseCart} from '../controllers/carts.controller.js'
import { authenticateUser } from '../controllers/sessions.controller.js'
import { authToken } from "../utils.js";
const router = Router();


router.get("/", getCarts)

router.post("/", authenticateUser, authToken, postCart)

router.get("/:id", getId)

router.post("/:cid/product/:pid", authToken, postIntoCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", authToken, updateCart)

router.put("/:cid/products/:pid", authToken, updateProductsToCart)

router.post("/:cid/purchase", authToken, purchaseCart)




export default router;
