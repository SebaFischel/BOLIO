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
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '30m' });
    return token;
};

export const authToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    
    if(!authToken) return res.status(401).send({error: 'Not authenticated'});

    const token = authToken.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: 'Not authorized'});
        req.user = credentials.user;
        next();
    })
}

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