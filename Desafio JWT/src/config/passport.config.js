import passport from 'passport';
import local, { Strategy } from 'passport-local';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/hashbcryp.js';

const LocalStrategy = local.Strategy;

const inicializePassport = () => {
  /* Strategy for register */
  passport.use(
    'register',
    new LocalStrategy(
      {
        /* Access to the object request */
        passReqToCallback: true,
        usernameField: 'email',
      },
      /* Register */
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        /* validation if the user exist */
        try {
          let user = await UserModel.findOne({ email });
          if (user) {
            /* if finds the email send done and it not create any user */
            return done(null, false);
          }
          /* create a new user */
          let newUser = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
          };
          /* save the new user in db */
          let createNewUser = await UserModel.create(newUser);
          /* if sucess send done and creates new user in our db */
          return done(null, createNewUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  /* Strategy for Login */
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, done) => {
        try {
          /* try to find the user in our db */
          let user = await UserModel.findOne({ email });
          if (!user) {
            console.log('Este usuario no existe en la base de datos');
            return done(null, false);
          }
          /* validation of the password */
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }
          /* if success */
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  /* Serialization and des-serialization */
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findOne({ _id: id });
    done(null, user);
  });
};

export default inicializePassport;
