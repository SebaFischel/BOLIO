import userModel from '../dao/dbManagers/models/UsersModel.js';
import { createHash, isValidPassword } from '../utils.js';
import { Router } from 'express';
import __dirname from '../utils.js';
import { generateToken } from '../utils.js';

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
      let PastTests = 0;
      const TotalTests = 3;
  
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
  
      if (!user) {
        PastTests++;
        console.log("Test 1: Incorrecto. Usuario no encontrado");
        return res.status(400).json({ status: 'error', error: 'User not found' });
      } else {
        PastTests++;
        console.log("Test 1: Correcto");
      }
  
      const isValid = await isValidPassword(password, user.password);
  
      if (!isValid) {
        PastTests++;
        console.log("Test 2: Incorrecto. Contraseña inválida");
        return res.status(400).json({ status: 'error', error: 'Invalid password' });
      } else {
        PastTests++;
        console.log("Test 2: Correcto");
      }
  
      const role = email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user';
      const token = generateToken({ email, role });
  
      PastTests++;
      console.log("Test 3: Correcto");
  
      console.log(`Tests Pasados: ${PastTests} / Total Tests: ${TotalTests}`);
  
      return res.json({ status: 'success', token, role});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error', error });
    }
  });
  
  
  const removeTokenFromStorage = () => {
    localStorage.removeItem('access_token');
};


  const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        removeTokenFromStorage();
        res.redirect('/login')
    })
};

const loginGithub = async (req, res) => {
    res.send({ status: "success", message: "User registered" })
    res.redirect('/products')
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