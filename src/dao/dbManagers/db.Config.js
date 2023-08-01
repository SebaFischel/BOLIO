import mongoose from 'mongoose';
import config from '../../config/config.js';
import { logger } from '../../utils.js'

const URI = config.mongoUrl;

try {
     mongoose.connect(URI);
    logger.info('DB CONNECTED');
} catch (error) {
    logger.error(error);    
}