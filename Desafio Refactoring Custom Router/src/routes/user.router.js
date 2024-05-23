// routes/user.router.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middlewares/auth.js';
import UserModel from '../models/user.model.js';

const router = express.Router();
const JWT_SECRET = 'coderhouse';

// Ruta de registro de usuario
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Registration failed');
    }
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }
);

// Ruta de perfil de usuario
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('cart');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user: user.toObject() });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
