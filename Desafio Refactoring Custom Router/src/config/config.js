// /config/config.js
import dotenv from 'dotenv';
import program from '../utils/process.js';

const { mode } = program.opts();

dotenv.config({
  path: mode === 'produccion' ? './.env.prod' : './.env.dev',
});

const configObject = {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
};

export default configObject;
