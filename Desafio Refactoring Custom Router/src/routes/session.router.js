import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import configObject from '../config/config.js';

const router = express.Router();
const JWT_SECRET = configObject.jwt_secret;

// Ruta de login de usuario
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Login failed');
    }
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }
);

// Ruta de logout de usuario
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/login');
});

// Ruta para autenticarse con Github
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

// Callback de autenticación de Github
router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }
);

export default router;
