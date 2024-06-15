import express from 'express';
import passport from 'passport';
import { authenticateJWT } from '../middlewares/auth.js';
import { registerUser, getUserProfile } from '../services/user.service.js';

const router = express.Router();

// Ruta de registro de usuario
router.post('/register', (req, res, next) => {
  console.log('Register route hit'); // Depuración
  passport.authenticate(
    'register',
    { session: false },
    async (err, user, info) => {
      if (err) {
        console.error('Error in Passport authenticate:', err); // Depuración
        return next(err);
      }
      if (!user) {
        console.log('User registration failed:', info.message); // Depuración
        return res.status(400).send('Registration failed');
      }
      try {
        const { token } = await registerUser(user);
        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.redirect('/profile'); // Redirigir al perfil del usuario
      } catch (error) {
        console.error('Error in registerUser:', error); // Depuración
        res.status(500).send(error.message);
      }
    }
  )(req, res, next);
});

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
