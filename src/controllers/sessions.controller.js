import userModel from '../dao/dbManagers/models/UsersModel.js';
import { createHash, isValidPassword } from '../utils.js';
import { Router } from 'express';
import __dirname from '../utils.js';
import { generateToken, authToken} from '../utils.js';
import { logger } from '../utils.js';
import UserDto from '../dao/DTOs/user.dto.js'

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
      logger.fatal(error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
  };
  

  const loginUser = async (req, res) => {
    try {
      let PastTests = 0;
      const TotalTests = 3;
  
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
  
      if (!user) {
        PastTests++;
        logger.warning("Test 1: Incorrecto. Usuario no encontrado");
        return res.status(400).json({ status: 'error', error: 'User not found' });
      } else {
        // Aquí es donde debes guardar el usuario en la sesión
        req.session.user = user;
        PastTests++;
        logger.info("Test 1: Correcto");
      }
  
      const isValid = await isValidPassword(password, user.password);
  
      if (!isValid) {
        PastTests++;
        logger.warning("Test 2: Incorrecto. Contraseña inválida");
        return res.status(400).json({ status: 'error', error: 'Invalid password' });
      } else {
        PastTests++;
        logger.info("Test 2: Correcto");
      }
  
      const role = email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user';
  
      // Generar el token
      const token = generateToken({ email, role });
  
      PastTests++;
      logger.info("Test 3: Correcto");
  
      logger.info(`Tests Pasados: ${PastTests} / Total Tests: ${TotalTests}`);
  
      return res.json({ status: 'success', token, role });
    } catch (error) {
      logger.fatal(error);
      return res.status(500).json({ status: 'error', error });
    }
  };
  
  const loginCallback = async (req, res) => {
    console.log('Datos del usuario autenticado:', req.user);
    
    req.session.user = req.user;
    res.redirect('/products');
  };

  
  
  const removeTokenFromSession = (req) => {
    delete req.session.token;
  };

  const logoutUser = (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Error al cerrar la sesión:', err);
        return res.status(500).send({ status: 'error', error: 'Logout fail' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
          return res.status(500).send({ status: 'error', error: 'Logout fail' });
        }
  
        res.redirect('/login'); 
      });
    });
  };
  

const loginGithub = async (req, res) => {
    res.send({ status: "success", message: "User registered" })
    res.redirect('/products')
  };
  
  const authenticateUser = (req, res, next) => {
    if (req.session && req.session.user) {
      // Si el usuario está autenticado, coloca los datos del usuario en req.user
      req.user = req.session.user;
      return next();
    }
    res.status(401).json({ status: 'error', error: 'No autorizado' });
  };

const getCurrentUser = (req, res) => {
  try {
    const userDto = new UserDto(req.user);
    res.send(userDto);
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};
  

  export default router;

  export {
    registerUser,
    loginCallback,
    loginGithub,
    loginUser,
    logoutUser,
    getCurrentUser,
    authenticateUser,
    removeTokenFromSession
  }