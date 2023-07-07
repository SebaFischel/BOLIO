import { Router } from 'express';
import userModel from '../models/UsersModel.js';
import bcrypt from 'bcrypt';
import passport from 'passport';


const router = Router();

const createHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.status(400).send({ status: 'error', error: 'User already exists' });
    }

    const hashedPassword = createHash(password);

    const user = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    };

    await userModel.create(user);
    res.send({ status: 'success', message: 'User registered' });
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

router.post('/login', async (req, res) => {
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

    res.send({ status: 'success', role });
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        res.redirect('/login')
    })
});

router.get('/github', passport.authenticate(
  'github', { scope: ['user:email'] }
), async (req, res) => {
  res.send({ status: "success", message: "User registered" })
});

router.get('/github-callback', passport.authenticate(
  'github', { failureRedirect: '/login' }
), async (req, res) => {
  req.session.user = req.user;
  res.redirect('/')
})


export default router;