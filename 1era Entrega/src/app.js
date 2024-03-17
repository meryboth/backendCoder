import express from 'express';
const app = express();
const PORT = 8080;

//Le podemos decir al servidor que vamos a trabajar con JSON y datos complejos:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Vinculamos las rutas */

import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

/* Usamos las rutas */

app.use('/', productsRouter);
app.use('/', cartRouter);

//Listen al servidor

app.listen(PORT, () => {
  console.log(`Estamos escuchando en el puerto ${PORT}`);
});
