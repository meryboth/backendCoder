import express from 'express';
import passport from 'passport';
import { authenticateJWT } from '../middlewares/auth.js';
import {
  registerUser,
  getUserProfile,
  getCurrentUser,
} from '../services/user.service.js';
import { userGenerator } from '../utils/userGenerator.js';
import CustomError from '../services/errors/CustomError.js';
import { ERROR_TYPES } from '../services/errors/enum.js';
import {
  generateUserError,
  generateAuthenticationError,
} from '../services/errors/info.js';

const router = express.Router();

// Faker para generar usuarios mock
router.get('/mock', (req, res) => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push(userGenerator());
  }
  res.send(users);
});

// Ruta de registro de usuario
router.post('/register', (req, res, next) => {
  console.log('Register route hit'); // Depuración
  passport.authenticate(
    'register',
    { session: false },
    async (err, user, info) => {
      if (err) {
        console.error('Error in Passport authenticate:', err); // Depuración
        return next(
          CustomError.createError({
            name: 'Authentication Error',
            cause: generateAuthenticationError(),
            message: err.message,
            type: 'AUTHENTICATION_ERROR',
          })
        );
      }
      if (!user) {
        console.log('User registration failed:', info.message); // Depuración
        return next(
          CustomError.createError({
            name: 'User Registration Error',
            cause: generateUserError(req.body),
            message: info.message,
            type: 'INVALID_TYPES_ERROR',
          })
        );
      }
      try {
        const { token } = await registerUser(user);
        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.redirect('/profile'); // Redirigir al perfil del usuario
      } catch (error) {
        console.error('Error in registerUser:', error); // Depuración
        return next(
          CustomError.createError({
            name: 'Database Error',
            cause: 'Error in registerUser',
            message: error.message,
            type: 'DATABASE_ERROR',
          })
        );
      }
    }
  )(req, res, next);
});

// Ruta de perfil de usuario
router.get('/profile', authenticateJWT, async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.render('profile', { user: user.toObject() });
  } catch (error) {
    return next(
      CustomError.createError({
        name: 'Database Error',
        cause: 'Error fetching user profile',
        message: error.message,
        type: 'DATABASE_ERROR',
      })
    );
  }
});

// Ruta para obtener la información actual del usuario
router.get('/current', authenticateJWT, async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching current user for email:', userEmail); // Depuración
    const user = await getCurrentUser(userEmail);
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error); // Depuración
    return next(
      CustomError.createError({
        name: 'Database Error',
        cause: 'Error fetching current user',
        message: error.message,
        type: 'DATABASE_ERROR',
      })
    );
  }
});

export default router;
