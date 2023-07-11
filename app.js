import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './src/routers/products.router.js';
import cartsRouter from './src/routers/carts.router.js';
import __dirname from './src/utils.js';
import viewsRouter from './src/routers/view.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './src/config/passport.config.js';
import passport from 'passport';
import sessionsRouter from './src/routers/sessions.router.js';
import ProductManager from './src/managers/ProductManager.js';
import authRouter from './src/routers/auth.router.js'


const app = express();
const server = app.listen(8080, () => console.log("Listening on PORT 8080"));
const io = new Server(server);


initializePassport();
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://fischelsebastian:coderhouse@cluster123.gudtuxt.mongodb.net/ecommerceCH?retryWrites=true&w=majority',
    ttl: 3600,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: 'Coder39760',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);

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

try {
  await mongoose.connect('mongodb+srv://fischelsebastian:coderhouse@cluster123.gudtuxt.mongodb.net/ecommerceCH?retryWrites=true&w=majority');
  console.log('DB CONNECTED');
} catch (error) {
  console.log(error);
}