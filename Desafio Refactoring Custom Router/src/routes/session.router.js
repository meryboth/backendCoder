// /routers/session.router.js
import CustomRouter from './router.js';
import passport from 'passport';
import configObject from '../config/config.js';
import jwt from 'jsonwebtoken';
import { validateUserLogin } from '../middlewares/validators.js';

const JWT_SECRET = configObject.jwt_secret;

class SessionRouter extends CustomRouter {
  init() {
    this.post(
      '/login',
      validateUserLogin,
      passport.authenticate('login', { session: false }),
      this.loginUser
    );
    this.get('/logout', this.logoutUser);
    this.get(
      '/github',
      passport.authenticate('github', { scope: ['user:email'] }),
      this.githubAuth
    );
    this.get(
      '/githubcallback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      this.githubCallback
    );
  }

  async loginUser(req, res) {
    if (!req.user) {
      return res.sendUserError('Login failed');
    }
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }

  logoutUser(req, res) {
    res.clearCookie('jwt');
    res.redirect('/login');
  }

  githubAuth(req, res) {}

  async githubCallback(req, res) {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true, secure: false });
    res.redirect('/profile');
  }
}

export default new SessionRouter().getRouter();
