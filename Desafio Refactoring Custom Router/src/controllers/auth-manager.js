import jwt from 'jsonwebtoken';

const JWT_SECRET = 'coderhouse';

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
