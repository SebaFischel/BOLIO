import{fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import winston from 'winston';

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
    console.log('No authToken provided');
    return res.status(401).send({ error: 'Not authenticated' });
  }

  const token = authToken.split(' ')[1];

  jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
    if (error) {
      console.log('Token verification error:', error);
      return res.status(403).json({ error: 'Token verification failed' });
    }
  
    // Verifica si el campo userId existe en el objeto decoded
    if (decoded && decoded.userId) { // Asegúrate de que decoded no sea nulo
      req.userId = decoded.userId;
      next();
    } else {
      console.log('Token JWT no contiene el campo userId del usuario');
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

            id: faker.database.mongodbObjectId(),
        
            title: faker.commerce.productName(),
        
            description: faker.commerce.productDescription(),
        
            code: faker.string.alpha(6),
        
            price: faker.commerce.price(),
        
            thumbnail: faker.image.image(),
        
            stock: faker.string.numeric(1),
        
            category: faker.commerce.productMaterial(),
        
          };
      };
      
      export const generateMockProduct = () => {
        let products = [];
      
        for (let i = 0; i < 100; i++) {
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
              filename: 'logs/errors.log',
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

    export {
      logger,
      addLogger
  }
 
export default __dirname;