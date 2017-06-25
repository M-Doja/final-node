require('./config/config');

const express = require('express'),
      _ = require('lodash'),
      hbs = require('hbs'),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      path = require('path'),
      port = process.env.PORT || 3000,
      app = express();

app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }))

// CREATE LOGGER
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log('Unable to append to server.log');
  });
   next();
});



// MIDDLEWARE
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

var mainRoutes = require('./routes/index');

app.use('/', mainRoutes);





app.listen(port, () => {
  console.log("App listening on port "+port);
});
