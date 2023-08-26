import { Router } from "express";
import { smsCustom, mail, whatsapp } from "../controllers/mailSms.controller.js";

const router = Router();

router.get("/mail", mail)

router.post("/smsCustom", smsCustom)

router.post("/whatsapp", whatsapp)


export default router;