import mongoose from 'mongoose';

const main = async () => {
  await mongoose.connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/pizzeria?retryWrites=true&w=majority&appName=Cluster0'
  );
  /* Calculamos el total de las pizzas vendidas por sabor pero solo en tamaño familiar */
  const resultado = await OrderModel.aggregate([
    {
      $match: {
        tam: 'familiar',
      },
    },
    {
      $group: {
        _id: '$nombre',
        total: {
          $sum: '$cantidad',
        },
      },
    },
    /* Que los datos se orden de mayor a menor y guardarlos en una nueva colección */
    {
      $sort: {
        total: -1, //Si es 1 es ascendente si es -1 es descendente
      },
    },
    {
      $group: {
        _id: 1,
        orders: {
          $push: '$$ROOT', //se guardan los resultados en un array y root hace ref al documento actual
        },
      },
    },
    {
      $project: {
        _id: 1,
        orders: '$orders', //Le avisamos que lo que va a guardar son los resultados que guardamos en el paso anterior
      },
    },
    {
      $merge: {
        into: 'reportes',
      },
    },
  ]);

  console.log(resultado);
};

/* Ejercicios de aggregate */
/* main(); */

import express from 'express';
const app = express();
const port = 8080;
import exphbs from 'express-handlebars';
import OrderModel from './models/order.model.js';
import './database/database.js';

/* configuramos handlebars */
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/* routes */
app.get('/', async (req, res) => {
  res.send('Home');
});

app.get('/pizzas', async (req, res) => {
  const page = req.query.page || 1;
  let limit = 2;
  try {
    const pizzas = await OrderModel.paginate({}, { limit, page });
    console.log(pizzas);

    const pizzasMap = pizzas.docs.map((pizza) => {
      const { _id, ...rest } = pizza.toObject();
      return rest;
    });

    res.render('pizzas', {
      pizzas: pizzasMap,
      hasPrevPage: pizzas.hasPrevPage,
      hasNextPage: pizzas.hasNextPage,
      currentPage: pizzas.page,
      prevPage: pizzas.prevPage,
      nextPage: pizzas.nextPage,
      totalPage: pizzas.totalPages,
    });
  } catch (error) {
    res.status('Error');
  }
});

/* listen */
app.listen(port, () => {
  console.log('Escuchando en el puerto:', port);
});
