var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const options = require('./knexfile');
const knex = require('knex')(options);
const verifyToken = require('./utilities/jwt').verifyToken;
const authChecker = require('./utilities/jwt').authChecker;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rankingsRouter = require('./routes/rankings');
var countryRouter = require('./routes/countries');
var factorsRouter = require('./routes/factors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// express middlewear settings
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middlewear for knex plus create users db if it does not exist
app.use(async (req, res, next) => {
  req.db = knex;
  await req.db.schema.hasTable('users').then(tableExists => {
    if(!tableExists){
      req.db.schema.createTable('users', table => {
        table.increments('id').notNullable().primary();
        table.string('email').unique();
        table.string('password');
        table.string('firstName');
        table.string('lastName');
        table.string('dob');
        table.string('address');
      }).then(TResult => {
        console.log("table successfully created");
      }).catch(reason => {
        if(reason){
          console.error(reason);
        }
      })
    }
  }) 
  next();
});

// middlewear for adding routes
app.use('/', indexRouter);
app.use('/user',authChecker, usersRouter);
app.use('/rankings', rankingsRouter);
app.use('/countries', countryRouter);
app.use('/factors', verifyToken, factorsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.status(404).json({
    "status": "error",
    "message": "Page not found!"
  })
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
