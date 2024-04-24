import express from 'express';
import mongoose from 'mongoose';
const app = express();
const port = 8080;
import exphbs from 'express-handlebars';
/* import './database.js'; */
import viewsRouter from './routes/view.routes.js';
import ProductModel from './models/product.model.js';
import ProductManager from './controllers/product.manager.js';

/* middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

/* handlebars */
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/* routes */

/* app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); */
app.use('/', viewsRouter);

/* listen */

const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el puerto: http://localhost:${port}`);
});

/* const main = async () => {
  await mongoose.connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
  );
  const productos = await ProductModel.find();
  console.log(productos);
};

main(); */
