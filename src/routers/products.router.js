import { Router } from "express";
import { postProduct, getProducts, getPid, deletePid, updatePid } from '../controllers/products.controller.js'


const router = Router();



router.post("/", postProduct)


router.get("/", getProducts)

router.get("/:pid", getPid)

router.delete("/:pid", deletePid)

router.put("/:pid", updatePid)

export default router;
