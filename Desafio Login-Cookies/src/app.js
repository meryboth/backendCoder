import express from 'express';
const app = express();
const PUERTO = 8080;
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';

const fileStore = new FileStore(session);

app.get('/', (req, res) => {
  res.send('Holaa');
});

const miClave = 'tinkiwinki';

/* Middleware */
app.use(express.json());
app.use(cookieParser());
/* app.use(cookieParser(miClave)); */
app.use(
  session({
    //1) Creamos una sesion con Memory Storage:

    secret: 'secretCoder',
    resave: true,
    //Esta config me permite mantener la sesión activa frente a la inactividad del usuario.
    saveUninitialized: true,
    //Me permite guardar sesión aun cuando el objeto de sesión no tenga nada para contener.

    //Utilizando File Storage:
    //npm i session-file-store

    //store: new fileStore({path:"./src/sessions", ttl: 100, retries: 1}),
    //path: es la ruta donde se van a aguardar los archivitos de la sesión.
    //ttl: Time To Live (en segundos),
    //retries: cantidad de veces que el servidor intentará leer el archivo.

    //Utilizamos Mongo Storage:
    //instalamos: npm i connect-mongo
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
      ttl: 15,
    }),
  })
);

//Repasito de cuki.

app.get('/crearcuki', (req, res) => {
  res.cookie('cuki', 'Esto es una cookie!').send('Cuki seteada!');
});

app.get('/borrarcuki', (req, res) => {
  res.clearCookie('cuki').send('Cuki borrada!');
});

//Login de usuario con Session:

app.get('/login', (req, res) => {
  let usuario = req.query.usuario;

  req.session.usuario = usuario;
  res.send('Guardamos el usuario por medio de query');
});

//Verificamos el usuario:

app.get('/usuario', (req, res) => {
  if (req.session.usuario) {
    return res.send(
      `El usuario registrado es el siguiente: ${req.session.usuario}`
    );
  }

  res.send('No tenemos un usuario registrado, vamos a morir. ');
});

app.listen(PUERTO, () => {
  console.log('Escuchando en el puerto: ' + PUERTO);
});
