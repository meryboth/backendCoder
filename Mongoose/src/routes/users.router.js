import express, { Router } from 'express';
const router = express.Router();

/* Import model */
import usersModel from '../models/users.model.js';

/* Get the list of users */
router.get('/', async (req, res) => {
  try {
    const users = await usersModel.find();
    res.json(users);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json('Error en el servidor');
  }
});

export default router;
