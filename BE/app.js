var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// mongoose
var mongoose = require('mongoose')
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	console.log("Connected")
})
mongoose.connect('mongodb+srv://test:test@cluster0.b9rhp.mongodb.net/?retryWrites=true&w=majority')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
