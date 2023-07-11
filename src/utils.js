import{fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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


export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10); 
    const hash = bcrypt.hashSync(password, salt); 
    return hash;
  };
  
  export const isValidPassword = (user, password) =>
    bcrypt.compareSync(password, user.password);



export default __dirname;