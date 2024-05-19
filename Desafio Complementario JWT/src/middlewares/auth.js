// middlewares/auth.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

const JWT_SECRET = 'coderhouse';

export const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id).populate('cart').lean();
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
