import jwt from 'jsonwebtoken';
import configObject from '../config/config';

const JWT_SECRET = configObject.jwt_secret;

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
