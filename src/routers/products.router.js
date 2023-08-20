import { Router } from "express";
import { postProduct, getProducts, getPid, deletePid, updatePid } from '../controllers/products.controller.js'
import { authToken } from "../utils.js";

const router = Router();



router.post("/", postProduct)

router.get("/", authToken, getProducts)

router.get("/:pid", getPid)

router.delete("/:pid",authToken, deletePid)

router.put("/:pid",authToken, updatePid)

export default router;
