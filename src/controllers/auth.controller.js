import { Router } from 'express';
import { generateToken } from '../utils.js';
import { logger } from '../utils.js'

const router = Router();
const users = [];

const jwtRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = users.find(user => user.email === email);

        if (exists) return res.status(400).send({ status: 'error', error: 'User already exists' });

        const user = {
            name,
            email,
            password
        }

        users.push(user);

        const accessToken = generateToken(user);

        res.send({ status: 'success', access_token: accessToken })
    } catch (error) {
        logger.fatal(error);
        res.status(500).send({ status: 'error', error: error.message });
    }
}

const jwtLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(user => user.email === email && user.password === password);

        if (!user) return res.status(400).send({ status: 'error', error: 'Credenciales incorrectas' });

        const accessToken = generateToken(user);

        res.send({ status: 'success', access_token: accessToken })
    } catch (error) {
        logger.fatal(error);
        res.status(500).send({ status: 'error', error });
    }
};


const jwtCurrent =  (req, res) => {
    res.send({ status: 'success', payload: req.user });
};

export default router; 

export {
    jwtCurrent,
    jwtLogin,
    jwtRegister
}