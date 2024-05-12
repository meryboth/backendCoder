import passport from 'passport';
import local, { Strategy } from 'passport-local';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/hashbcryp.js';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

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
  /* Github Strategy */
  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: 'Iv23limCsei8SwDYQzSy',
        clientSecret: '05381d6be05817fb9e14b07994bd5ca500f9338c',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Profile:', profile);
        //Veo los datos del perfil
        console.log('Profile:', profile);

        try {
          let usuario = await UserModel.findOne({ email: profile._json.email });

          if (!usuario) {
            let nuevoUsuario = {
              first_name: profile._json.name,
              last_name: '',
              age: 36,
              email: profile._json.email,
              password: 'miau',
            };

            let resultado = await UserModel.create(nuevoUsuario);
            done(null, resultado);
          } else {
            done(null, usuario);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default inicializePassport;
