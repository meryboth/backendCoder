// /routers/user.router.js
import CustomRouter from './router.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middlewares/auth.js';
import UserModel from '../models/user.model.js';
import { validateUserRegistration } from '../middlewares/validators.js';

const JWT_SECRET = 'coderhouse';

class UserRouter extends CustomRouter {
  init() {
    this.post(
      '/register',
      validateUserRegistration,
      passport.authenticate('register', { session: false }),
      this.registerUser
    );
    this.get('/profile', authenticateJWT, this.getProfile);
  }

  async registerUser(req, res) {
    if (!req.user) {
      return res.sendUserError('Registration failed');
    }
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }

  async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.id).populate('cart');
      if (!user) {
        return res.sendUserError('User not found');
      }
      res.render('profile', { user: user.toObject() });
    } catch (error) {
      res.sendServerError(error);
    }
  }
}

export default new UserRouter().getRouter();
