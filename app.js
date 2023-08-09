import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './src/routers/products.router.js';
import cartsRouter from './src/routers/carts.router.js';
import __dirname from './src/utils.js';
import viewsRouter from './src/routers/view.router.js';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './src/passport/passport.config.js';
import passport from 'passport';
import sessionsRouter from './src/routers/sessions.router.js';
import ProductManager from './src/dao/dbManagers/ProductManager.js';
import authRouter from './src/routers/auth.router.js';
import './src/dao/dbManagers/db.Config.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import  mockingProducts  from './src/routers/mocking.router.js'
import { addLogger } from './src/utils.js';
import { logger } from './src/utils.js'
import logsRouter from './src/routers/logs.router.js'




const app = express();
const server = app.listen(8080, () => logger.debug("Listening on PORT 8080"));
const io = new Server(server);


initializePassport();
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    secret: 'Coder39760', // Reemplaza esto con una clave secreta adecuada para tu aplicación
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://fischelsebastian:coderhouse@cluster123.gudtuxt.mongodb.net/ecommerceCH?retryWrites=true&w=majority', // Reemplaza esto con la URL de tu base de datos MongoDB
      ttl: 3600, // Opcional: tiempo de vida de la sesión en segundos (por defecto, 14 días)
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/api/mocking', mockingProducts)
app.use('/api/logs', logsRouter)


const productsOnList = [];
const messages = [];

io.on("connection", (socket) => {
  console.log("Connection with socket:", socket.id);

  socket.emit("productList", productsOnList);

  socket.on("newProduct", (data) => {
    ProductManager.addProduct(data);
    io.emit("productList", productsOnList);
    console.log("Product added", data);
  });

  socket.on("deleteProduct", (id) => {
    ProductManager.deleteProduct(id);
    io.emit("productList", productsOnList);
  });

  socket.on('message', data => {
    messages.push(data);
    io.emit('messageLogs', messages);
});

socket.on('authenticated', data => {
    socket.emit('messageLogs', messages);
    socket.broadcast.emit('newUserConnected', data);
});
});



const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'fischel.sebastian@gmail.com',
        pass: 'vazwbjtzlzpfpsep'
    }
});

app.get('/mail', async (req, res) => {
    await transporter.sendMail({
        from: 'CorderHouse 39760',
        to: 'sebadelgm@gmail.com',
        subject: 'Correo de prueba 39760',
        html: `<div><h1>Hola, esto es una prueba de envio de correo usando gmail</h1>`
    });
    res.send('Correo enviado');
});

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
)


app.post('/sms-custom', async (req, res) => {
  const { name, product } = req.body;
  await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: '+59893656610',
      body: `Hola ${name} gracias por tu compra. Tu producto es ${product}`
  });

  res.send('SMS sent')
});

app.post('/whatsapp', async(req, res) => {
  const { name, product } = req.body;
  await client.messages.create({
      body: `Hola ${name} gracias por tu compra. Tu producto es ${product}`,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+59893656610',
  });

  res.send('Whatsapp sent')
})