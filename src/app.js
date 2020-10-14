/*
Callum
Consumer Keys
API KEY:  8DEciTD5bVy4HQdSIXRevYFZI 
secret key: lW1I6Sc3xMxDv8QNqz3Pbefe5ANbVTa91ldonJFxpii95IVHAv

Auth
bearer token: AAAAAAAAAAAAAAAAAAAAANpSIgEAAAAA9nGL%2FC2daCSOKX6TC4jMVYMDwvc%3D3a4Ak9TiKvRn98ceC2yII7w0zTqp3ollbO3xAmGRODDTR2b4Sn
Access token:1072388204534292480-4f6rYbuBeZ9r00Ry6xkaa5bW2Qj5eX
Access token secret:0qdK02JjKNjerysctpWgVFUU3Dvn1jJqwtmsIr1uiJICS
*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
