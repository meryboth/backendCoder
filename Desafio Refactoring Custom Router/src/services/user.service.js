// services/user.service.js
import UserModel from '../models/user.model.js';
import { generateToken } from '../auth/auth.manager.js';

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
