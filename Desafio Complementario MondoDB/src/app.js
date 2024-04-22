import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io'; // Importar Server desde 'socket.io'
import './database.js'; // Asíncrono, no necesita asignación

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const PUERTO = 8080;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

//Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//Rutas:
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

//Desafio loco del chat en el ecommerce:
import MessageModel from './models/message.model.js';
const io = new Server(httpServer); // Usar Server para crear la instancia de Socket.IO

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('message', async (data) => {
    //Guardo el mensaje en MongoDB:
    await MessageModel.create(data);

    //Obtengo los mensajes de MongoDB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit('message', messages);
  });
});
