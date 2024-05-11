import mongoose from 'mongoose';

mongoose
  .connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('Conexion exitosa'))
  .catch((error) => console.log('Error en la conexion', error));
