import express from 'express';
import exphbs from 'express-handlebars';
const app = express();
const PORT = 8080;
import viewsRouter from './routes/views.router.js';

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

//Rutas
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/', viewsRouter);

//handlebars config
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//listen to port
const httpServer = app.listen(PORT, () => {
  console.log('Escuchando en el port 8080');
});

//Importamos el modulo
import { Server } from 'socket.io';
//Linkeamos el server con socket. Generamos una instancia del lado del server.
const io = new Server(httpServer);

//Escuchamos la peticion del cliente desde main.js:
io.on('connection', async (socket) => {
  console.log('Un cliente conectado');

  //Enviamos el array de productos al cliente:
  socket.emit('productos', await productManager.getProducts());

  //Recibimos el evento "eliminarProducto" desde el cliente:
  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id);
    //Enviamos el array de productos actualizados:
    socket.emit('productos', await productManager.getProducts());
  });

  //Recibimos el evento "agregarProducto" desde el cliente:
  socket.on('agregarProducto', async (producto) => {
    await productManager.addProduct(producto);
    socket.emit('productos', await productManager.getProducts());
  });
});
