// routes/user.router.js
import express from 'express';
import passport from 'passport';
import { authenticateJWT } from '../middlewares/auth.js';
import { registerUser, getUserProfile } from '../services/user.service.js';

const router = express.Router();

// Ruta de registro de usuario
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).send('Registration failed');
      }
      const { user, token } = await registerUser(req.user);
      res.cookie('jwt', token, { httpOnly: true, secure: false });
      res.redirect('/profile');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Ruta de perfil de usuario
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.render('profile', { user: user.toObject() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
