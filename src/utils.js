import{fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import winston from 'winston';
import path from 'path';

dotenv.config();

const PRIVATE_KEY = 'coder39760';

const ENVIRONMENT = process.env.NODE_ENV;

export const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, PRIVATE_KEY, { expiresIn: '10y' });
  return token;
};

export const authToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    logger.error('No authToken provided');
    return res.status(401).send({ error: 'Not authenticated' });
  }

  const token = authToken.split(' ')[1];

  jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
    if (error) {
      logger.error('Token verification error:', error);
      return res.status(403).json({ error: 'Token verification failed' });
    }
  
    if (decoded && decoded.userId) { 
      req.userId = decoded.userId;
      next();
    } else {
      logger.error('Token JWT no contiene el campo userId del usuario');
      return res.status(403).json({ error: 'Token JWT no contiene el campo userId del usuario' });
    }
  });

};

export const isValidPassword = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };


export const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const fakeProductGenerator = () => {
      return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(6),
        price: faker.number.int({ min: 1, max: 1000, precision: 0.01 }),
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.productMaterial(),
        status: true,
      };
    };
      
      export const generateMockProduct = (count) => {
        let products = [];
      
        for (let i = 0; i < count; i++) {
          products.push(fakeProductGenerator());
        }
      
        return products;
      };
    

      const customLevelOptions = {
        levels: {
          debug: 5,
          http: 4,
          info: 3,
          warning: 2,
          error: 1,
          fatal: 0,
        },
        colors: {
          http: 'cyan',
          fatal: 'red',
          error: 'red',
          warning: 'yellow',
          info: 'green',
          debug: 'blue',
        },
      };
      
      let logger;
      
      if (ENVIRONMENT === 'development') {
        logger = winston.createLogger({
          levels: customLevelOptions.levels,
          transports: [
            new winston.transports.Console({
              level: 'debug',
              format: winston.format.combine(
                winston.format.colorize({
                  all: true,
                  colors: customLevelOptions.colors,
                }),
                winston.format.simple()
              ),
            }),
          ],
        });
      } else if (ENVIRONMENT === 'production') {
        logger = winston.createLogger({
          levels: customLevelOptions.levels,
          transports: [
            new winston.transports.Console({
              level: 'info',
              format: winston.format.combine(
                winston.format.colorize({
                  all: true,
                  colors: customLevelOptions.colors,
                }),
                winston.format.simple()
              ),
            }),
            new winston.transports.File({
              filename: path.join(__dirname, '..', 'logs', 'errors.log'), 
              level: 'error',
            }),
          ],
        });
      } else {
        logger = winston.createLogger({
          levels: customLevelOptions.levels,
          transports: [
            new winston.transports.Console({
              level: 'info',
              format: winston.format.combine(
                winston.format.colorize({
                  all: true,
                  colors: customLevelOptions.colors,
                }),
                winston.format.simple()
              ),
            }),
          ],
        });
      }

      const addLogger = (req, res, next) => {
        req.logger = logger;
        next();
    }

    logger.info(`ENVIRONMENT is set to: ${ENVIRONMENT}`);

    export {
      logger,
      addLogger
  }
 
export default __dirname;