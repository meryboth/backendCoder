// services/user.service.js
/* import UserModel from '../models/user.model.js';
import { generateToken } from '../controllers/auth-manager.js';

export const registerUser = async (userData) => {
  const user = new UserModel(userData);
  await user.save();
  const token = generateToken(user);
  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await UserModel.findById(userId).populate('cart');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
 */

import DAOFactory from '../dao/daoFactory.js';
import { generateToken } from '../controllers/auth-manager.js';

const userDAO = DAOFactory.getDAO('user', process.env.DATA_SOURCE);

export const registerUser = async (userData) => {
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
