// /routers/user.router.js
import CustomRouter from './router.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middlewares/auth.js';
import UserModel from '../models/user.model.js';
import { validateUserRegistration } from '../middlewares/validators.js';

const JWT_SECRET = 'coderhouse';

class UserRouter extends CustomRouter {
  init() {
    this.post('/register', validateUserRegistration, async (req, res) => {
      const { name, email, password } = req.body;

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
          name,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, email: newUser.email },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.status(201).json({ redirectUrl: '/profile' });
      } catch (error) {
        console.error('Error registering user:', error);
        res
          .status(500)
          .render('register', { errors: [{ msg: 'Internal server error' }] });
      }
    });

    this.get('/profile', authenticateJWT, this.getProfile);
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
