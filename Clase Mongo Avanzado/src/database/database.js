import mongoose from 'mongoose';

mongoose
  .connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/pizzeria?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Conexión exitosa con la BD');
  })
  .catch((error) => {
    console.log('Error en la conexión con BD:', error);
  });
