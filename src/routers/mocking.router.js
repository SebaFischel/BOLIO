import { Router } from "express";
import { mockingProducts } from '../controllers/mocking.controller.js'

const router = Router();

router.get("/mockingProducts", mockingProducts )





export default router;