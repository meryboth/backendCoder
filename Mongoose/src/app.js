import express from 'express';
const app = express();
const port = 8080;
import userRouter from './routes/users.router.js';

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */

app.use('/', userRouter);

/* Listen */

app.listen(port, () => {
  console.log(`Escuchando en el puerto: ${port}`);
});

/* Connection with MongoAtlas throught Mongoose */
import mongoose from 'mongoose';
mongoose
  .connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Conectados a la base de datos');
  })
  .catch((error) => {
    console.log('Tenemos un error:', error);
  });
