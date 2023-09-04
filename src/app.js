import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import __dirname from './utils.js';
import viewsRouter from './routers/view.router.js';
import { Server } from 'socket.io';
import initializePassport from './passport/passport.config.js';
import passport from 'passport';
import sessionsRouter from './routers/sessions.router.js';
import ProductManager from './dao/dbManagers/ProductManager.js';
import authRouter from './routers/auth.router.js';
import './dao/dbManagers/db.Config.js';
import mockingProducts from './routers/mocking.router.js';
import { addLogger } from './utils.js';
import { logger } from './utils.js';
import logsRouter from './routers/logs.router.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import contact from './routers/mailSms.router.js';
import dotenv from  'dotenv'
import sessionConfig from './config/sessionConfig.js'
import usersRouter from './routers/users.router.js'

dotenv.config();

const PORT = process.env.PORT

const app = express();
const server = app.listen(PORT, () => logger.debug(`Listening on PORT ${PORT}`));
const io = new Server(server);

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación del proyecto de e-commerce CoderHouse',
      description: 'API pensada para un e-commerce',
    },
    components: {
      securitySchemes: {
        jwtAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ jwtAuth: [] }],
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs, {
  swaggerOptions: {
    plugins: [
      {
        statePlugins: {
          auth: {
            authorize: (_request, _authSelectors) => {
              const jwtToken = localStorage.getItem('jwtToken');
              return jwtToken || '';
            },
          },
        },
      },
    ],
  },
}));


initializePassport();
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionConfig());

app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/api/mocking', mockingProducts);
app.use('/api/logs', logsRouter);
app.use('/', contact);
app.use('/api/users', usersRouter)

const productsOnList = [];
const messages = [];

io.on("connection", (socket) => {
  logger.info("Connection with socket:", socket.id);

  socket.emit("productList", productsOnList);

  socket.on("newProduct", (data) => {
    ProductManager.addProduct(data);
    io.emit("productList", productsOnList);
    logger.info("Product added", data);
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
