// /config/config.js
import dotenv from 'dotenv';
import program from '../utils/process.js';

const { mode } = program.opts();

dotenv.config({
  path: mode === 'produccion' ? './.env.prod' : './.env.dev',
});

const configObject = {
  puerto: process.env.PUERTO,
  mongo_url: process.env.MONGO_URL,
};

export default configObject;
