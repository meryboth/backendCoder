import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';
import CartManager from '../controllers/cart-manager.js';

const cartManager = new CartManager();
const JWT_SECRET = 'coderhouse';

const initializePassport = () => {
  // Estrategia de login local
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Estrategia de registro local
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: 'Email already taken' });
          }
          const hashedPassword = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10)
          );

          const newCart = await cartManager.newCart([]);

          const newUser = new UserModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            password: hashedPassword,
            age: req.body.age,
            cart: newCart._id,
          });

          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Estrategia de autenticación JWT
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Estrategia de autenticación con GitHub
  passport.use(
    new GithubStrategy(
      {
        clientID: 'Iv23limCsei8SwDYQzSy',
        clientSecret: '05381d6be05817fb9e14b07994bd5ca500f9338c',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({
            email: profile.emails[0].value,
          });
          if (!user) {
            const newCart = await cartManager.newCart([]);

            const newUser = new UserModel({
              first_name: profile.displayName || 'N/A',
              last_name: '',
              email: profile.emails[0].value,
              password: '',
              age: 0,
              cart: newCart._id,
            });
            user = await newUser.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default initializePassport;
