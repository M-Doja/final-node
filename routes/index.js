const express = require('express'),
      _ = require('lodash'),
      {mongoose} = require('./../db/mongoose'),
      {User} = require('./../models/user'),
      {authenticate} = require('./../middleware/authenticate')
      router = express.Router();

// ------------------------------------
// NAVIGATION AND INDIVIUAL PAGE ROUTES
// ------------------------------------
router.get('/', (req, res) => {
  res.render('main.hbs', {
    welcomeMsg: 'Welcome to the App',
    title: 'Phoja',
    text:' ',
    signIn: 'Sign In',
    join: 'Join the community'
  });
});

router.get('/home', (req, res) => {
  res.render('home.hbs', {
    welcomeMsg: 'Welcome to the home page',
    title: 'Home Page'
  });
});

router.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'About Page',
    text: 'Some text here'
  });
});

router.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    projectMsg: 'Take a look at my projects',
    title: 'Project page'
  });
});

router.get('/bad', (req, res) => {
  res.send({
    error: 'Error! 404 Bad request!'
  });
});

// ------------------------------------
// USER ROUTES
// ------------------------------------
router.post('/register', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/user/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send(200);
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;
