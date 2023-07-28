import{fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';


const PRIVATE_KEY = 'coder39760';

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
    

export default __dirname;