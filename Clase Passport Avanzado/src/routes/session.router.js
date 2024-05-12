import express from 'express';
const router = express.Router();
import passport from 'passport';

/* MONGO DB VERSION OF SESSION CREATION */
/* router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await UserModel.findOne({ email: email });
    if (usuario) {
      if (isValidPassword(password, usuario)) {
        req.session.login = true;
        req.session.user = {
          email: usuario.email,
          age: usuario.age,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          role: usuario.role,
        };

        res.redirect('/');
      } else {
        res.status(401).send({ error: 'Contraseña no valida' });
      }
    } else {
      res.status(404).send({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).send({ error: 'Error en el login' });
  }
}); */

/* PASSSPORT VERSION */

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/failedlogin',
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send('Wrong user and password. Try again.');
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.login = true;
    res.redirect('/profile');
  }
);

router.get('/failedregister', async (req, res) => {
  res.send('Login fallido, intentar de nuevo');
});

router.get('/logout', (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect('/login');
});

/* Github */

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  }),
  async (req, res) => {}
);

router.get(
  '/githubcallback',
  passport.authenticate('github', {
    failureRedirect: '/login',
  }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect('/profile');
  }
);

export default router;
