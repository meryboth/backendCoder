const fs = require('fs');

const rutaSin = './ejemplo-sin.txt';

/* Crea un archivo */
fs.writeFileSync(rutaSin, 'Hola, estamos trabajando en un ejemplo sincrónico');

/* Valida que el archivo exista y despues lo lee */
if (fs.existsSync(rutaSin)) {
  let contenido = fs.readFileSync(rutaSin, 'utf-8');
  console.log(contenido);
} else {
  console.log('No tenes ningun archivo');
}

/* Actualizar contenido */
fs.writeFileSync(rutaSin, 'Contenido actualizado');

/* Leer el archivo nuevamente para obtener el contenido actualizado */
contenido = fs.readFileSync(rutaSin, 'utf-8');
console.log(contenido);
fs.appendFileSync(rutaSin, 'Y este es el final.', () => {});
//leemos el archivo
contenido = fs.readFileSync(rutaSin, 'utf-8');
console.log(contenido);
//lo actualizamos
fs.appendFileSync(rutaSin, 'Texto agregado al final.', () => {});
console.log(contenido);
//eliminamos
fs.unlinkSync(rutaSin);

/* Trabajando con Callbacks */

/* const conCall = './ejemplo-con.txt';

fs.writeFile(conCall, 'Nuevo Archivo, ahora con callbacks', (error) => {
  ///detectamos un error al crear el archivo
  if (error) return console.log('No pudimos crear el archivo');
  //leemos el archivo
  fs.readFile(conCall, 'utf-8', (error, contenido) => {
    if (error) return console.log('No puede leerse el archivo');
    console.log(contenido);
  });
  //agregamos info
  fs.appendFile(conCall, '... mas contenido', (error) => {
    if (error) return console.log('No pudimos agregarlo');
  });
  //eliminamos
  fs.unlink(conCall, (error) => {
    if (error) console.log('No podemos eliminarlo');
  });
}); */

/* Trabajar con promesas */

const conPromises = './ejemplo-pro.txt';

const operacionesAsincronicas = async () => {
  //creamos el archivo
  await fs.promises.writeFile(conPromises, 'Nuevo archivo');
  //leemos el archivo
  let respuesta = await fs.promises.readFile(conPromises, 'utf-8');
  console.log(respuesta);
  //lo actualizamos
  await fs.promises.appendFile(conPromises, '...nuevo contenido');
  //lo releemos
  respuesta = await fs.promises.readFile(conPromises, 'utf-8');
  console.log(respuesta);
  //lo eliminamos
  await fs.promises.unlink(conPromises);
};
operacionesAsincronicas();

/* Operaciones complejas */

const arrayPersonas = [
  {
    nombre: 'Pepe',
    apellido: 'Argento',
    edad: 50,
  },
  {
    nombre: 'Moni',
    apellido: 'Argento',
    edad: 45,
  },
  {
    nombre: 'Paola',
    apellido: 'Argento',
    edad: 20,
  },
  {
    nombre: 'Coky',
    apellido: 'Argento',
    edad: 17,
  },
];

// Creamos un archivo

const archivoArgento = './archivo-argento.json';

const guardarArchivos = async () => {
  await fs.promises.writeFile(
    archivoArgento,
    JSON.stringify(arrayPersonas, null, 2)
  );
};
guardarArchivos();

// Lo leemos

const leerArchivos = async () => {
  const respuesta = await fs.promises.readFile(archivoArgento, 'utf-8');
  const nuevoArray = JSON.parse(respuesta);
  console.log(nuevoArray);
};
leerArchivos();

// Lo modificamos
