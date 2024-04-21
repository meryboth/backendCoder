import mongoose from 'mongoose';
import UserModel from './models/usuarios.js';
import AlumnoModel from './models/alumnos.js';
import CursoModel from './models/curso.js';

const main = async () => {
  await mongoose.connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/coder?retryWrites=true&w=majority&appName=Cluster0'
  );

  /* Método explain me da una estadistica de la consulta */
  const respuesta = await UserModel.find({ edad: { $lt: 19 } }).explain(
    'executionStats'
  );
  console.log(respuesta);
};
/* main(); */

const principal = async () => {
  await mongoose.connect(
    'mongodb+srv://mbotheatoz:root@cluster0.eo4tsnx.mongodb.net/coder?retryWrites=true&w=majority&appName=Cluster0'
  );

  /*   const estudiantePedro = await AlumnoModel.findById(
    '662580b2bfb4450ea027086e'
  );
  console.log(estudiantePedro);

  const cursoBackend = await CursoModel.findById('66258087bfb4450ea0270867');
  console.log(cursoBackend);


  estudiantePedro.cursos.push(cursoBackend);

  await AlumnoModel.findByIdAndUpdate(
    '662580b2bfb4450ea027086e',
    estudiantePedro
  ); */
  const estudiantesCompletos = await AlumnoModel.findById(
    '662580b2bfb4450ea027086e'
  );
  console.log(estudiantesCompletos);
};

principal();
