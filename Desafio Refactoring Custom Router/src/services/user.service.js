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
  console.log('Fetching user profile for ID:', userId); // Depuración
  const user = await userDAO.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Nueva función para obtener solo la información necesaria del usuario
export const getCurrentUser = async (email) => {
  console.log('Fetching current user for email:', email); // Depuración
  const user = await userDAO.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  // Devuelve solo la información necesaria
  const { first_name, last_name, email: userEmail, role } = user;
  console.log('Current user data:', { first_name, last_name, userEmail, role }); // Depuración
  return { first_name, last_name, userEmail, role };
};
