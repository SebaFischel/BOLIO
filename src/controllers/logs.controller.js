import { Router } from "express";
import __dirname from "../utils.js";

const router = Router();

const getLogs = async (req, res) => {
    
   req.logger.debug('Debug');
   req.logger.http('Http');
   req.logger.info('Info');
   req.logger.warning('Warning');
   req.logger.error('Error');
   req.logger.fatal('Error fatal');
};

export default router;

export {
    getLogs
}