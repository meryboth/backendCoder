import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import config from '../config/config.js';

const JWT_SECRET = config.jwt_secret;

export const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('Access denied. No token provided.'); // Depuración
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded); // Depuración

    const user = await UserModel.findById(decoded.id).lean();

    if (!user) {
      console.log('User not found.'); // Depuración
      return res.status(404).send('User not found');
    }

    req.user = user;
    console.log('User authenticated:', req.user); // Depuración
    next();
  } catch (ex) {
    console.log('Invalid token:', ex); // Depuración
    res.status(400).send('Invalid token.');
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('User is admin:', req.user); // Depuración
    next(); // El usuario es admin, continua con la siguiente función middleware
  } else {
    console.log('Access denied: Only administrators can access this route.'); // Depuración
    res
      .status(403)
      .send('Access denied: Only administrators can access this route.');
  }
};

export const isUser = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (user.role === 'user') {
      next(); // El usuario tiene el rol de usuario, continúa con la siguiente función middleware
    } else {
      res
        .status(403)
        .send('Access denied: Only regular users can access this route.');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};
