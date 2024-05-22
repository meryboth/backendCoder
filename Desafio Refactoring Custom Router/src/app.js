import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import './database.js';
import productsRouter from './routes/product.router.js';
import viewsRouter from './routes/views.router.js';
import cartRouter from './routes/cart.router.js';
import sessionRouter from './routes/session.router.js';
import userRouter from './routes/user.router.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const port = 8080;

/* middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(cookieParser());
app.use(
  session({
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
initializePassport();

/* handlebars */
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/* routes */
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);

/* listen */
const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el puerto: http://localhost:${port}`);
});
