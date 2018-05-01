const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const dotenv = require('dotenv');
const express = require('express');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const flash = require('express-flash');
const logger = require('morgan');
const lusca = require('lusca');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');


/******
 * 
 * APPLICATION SETUP
 * 
 *****/

// load environment variables
dotenv.load({ path: '.env'});

// setup app server
var app = express();


// connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://capstonedb.documents.azure.com:10255/capstonedb?ssl=true', {
    auth: {
      user: 'capstonedb',
      password: '4OZ1HralvXeqI4cLB00eGF0Z51v6XkXYNWkBbPvK44kffwv0SOoxXpwZZr3XYl3glXTHWXYR0p4gtrsfvIhHKw=='
    }
  })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));


// set up passport config

const passportConfig = require('./config/passport');

/******
 * 
 * EXPRESS CONFIGURATION
 * 
 *****/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 10000000 }));

app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'McefgOkipULBj060cPdworkhpeiFnD6U',
  cookie: { maxAge: 10000000 }, // two weeks in milliseconds
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  if (req.path === '/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user && req.path !== '/login' && req.path !== '/signup') {
    res.redirect('/login');
  } else {
    next();
  }
});






/******
 * 
 * ROUTING
 * 
 *****/

// set up route controllers
const indexRouter = require('./controllers/index');
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
//const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const setupController = require('./controllers/setup');
const monitorController = require('./controllers/monitor');
const resultsController = require('./controllers/results');
const deviceController = require('./controllers/devices');
const uploadController = require('./controllers/upload');



// home routing
app.get('/', homeController.index);
app.get('/home', homeController.index);

// profile routing
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

// study setup routing
app.get('/setup', setupController.getSetup);
app.get('/setup/configure', setupController.getConfigure);
app.post('/setup/configure', setupController.postConfigure);
app.get('/setup/configure/:id', setupController.getConfigureWithInfo);
app.get('/setup/teams/:id', setupController.getTeams);
app.get('/setup/review/:id/:teams', setupController.getReviewWithInfo);

// active monitoring routing
app.get('/monitor/pause/:id', monitorController.getPauseStudy);
app.get('/monitor/resume/:id', monitorController.getResumeStudy);
app.get('/monitor/end/:id', monitorController.getEndStudy);
app.get('/monitor/:id', monitorController.getActive);
app.get('/monitor', monitorController.getInactive);

// results routing
app.get('/results', resultsController.getViewAll);
app.get('/results/:id', resultsController.getStudyResults);
app.get('/delete/:id', resultsController.deleteStudy);

// device routing
app.get('/devices', deviceController.getAllDevices);

// upload routing
app.get('/upload', uploadController.getUpload);
app.get('/upload/:id', uploadController.getUploadWithData);
//app.post('/upload', upload.fields([{ name: 'audio', maxCount: 10}]), uploadController.postUpload);
//app.post('/upload', upload.single('audio'), uploadController.postUpload);
app.post('/upload', uploadController.postUpload)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
