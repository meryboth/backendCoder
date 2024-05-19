// middlewares/auth.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'coderhouse';

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt; // Obtener el token de las cookies
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verificar el token
    req.user = decoded; // Asignar el usuario decodificado a req.user
    next(); // Pasar al siguiente middleware o ruta
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
