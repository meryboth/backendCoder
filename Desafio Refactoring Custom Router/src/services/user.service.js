import DAOFactory from '../dao/daoFactory.js';
import { generateToken } from '../controllers/auth-manager.js';
import config from '../config/config.js';

const userDAO = DAOFactory.getDAO('users', config.data_source);

export const registerUser = async (userData) => {
  console.log('Registering user:', userData); // Depuración
  const user = await userDAO.createUser(userData);
  const token = generateToken(user);
  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await userDAO.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
