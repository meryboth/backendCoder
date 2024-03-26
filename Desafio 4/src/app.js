import express from 'express';
import exphbs from 'express-handlebars';
const app = express();
const PORT = 8080;
import viewsRouter from './routes/views.router.js';

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

//routes
app.use('/', viewsRouter);

//Config HandleBars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/* listen to port */
app.listen(PORT, () => {
  console.log('Escuchando en el port 8080');
});
