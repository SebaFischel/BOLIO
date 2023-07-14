import userModel from '../dao/dbManagers/models/UsersModel.js';
import { createHash, isValidPassword } from '../utils.js';
import { Router } from 'express';
import __dirname from '../utils.js';

const router = Router();


const registerUser = async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name  || !email || !age  || !password)
      return res.status(400).send({ status: 'error', error: 'Incomplete values' });

      const exists = await userModel.findOne({ email });
  
      if (exists) {
        return res.status(400).send({ status: 'error', error: 'User already exists' });
      }
  
      const hashedPassword = createHash(password);
      
      const newUser = {
        ...req.body
      };
      
      newUser.password = hashedPassword;

      await userModel.create(newUser);
      res.redirect('/login'); 
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
  };
  
  const loginUser = router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(400).send({ status: 'error', error: 'User not found' });
      }
  
      const isValid = isValidPassword(user, password);
  
      if (!isValid) {
        return res.status(400).send({ status: 'error', error: 'Invalid password' });
      }
  
      const role =
        email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user';
  
      if (role === 'admin') {
        res.redirect('/products');
      } else {
        res.redirect('/products');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 'error', error });
    }
  });

  const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        res.redirect('/login')
    })
};

const loginGithub = async (req, res) => {
    res.send({ status: "success", message: "User registered" })
    res.redirect('/')
  };

  const loginCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products')
  };

  export default router;

  export {
    registerUser,
    loginCallback,
    loginGithub,
    loginUser,
    logoutUser
  }