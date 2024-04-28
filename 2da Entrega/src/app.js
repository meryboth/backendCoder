import express from 'express';
import mongoose from 'mongoose';
const app = express();
const port = 8080;
import exphbs from 'express-handlebars';
import './database.js';
import productsRouter from './routes/product.routes.js';
import viewsRouter from './routes/views.router.js';
import cartRouter from './routes/cart.routes.js';

/* middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

/* handlebars */
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/* routes */
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

/* listen */

const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el puerto: http://localhost:${port}`);
});
