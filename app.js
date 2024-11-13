let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require("dotenv").config();

require("./mvc/models/db");

let apiRouter = require('./mvc/routes/api');

let app = express();

app.set('views', path.join(__dirname,'mvc', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Angular','build')));


app.use((req,res,next) => {
	res.statusJson = (statusCode,data) => {
		let obj = {
			...data,
			statusCode:statusCode
		}
		res.status(statusCode).json(obj);
	}
	let url = "";
	if(process.env.NODE_ENV==="PRODUCTION"){
		url = "https://interview-scheduler-ib.vercel.app";
	}else {
		url = "http://localhost:4200";
	}
	res.header("Access-Control-Allow-Origin", url);
	res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
	next();
})

app.use('/api', apiRouter);
app.get("*",(req,res,next)=>{
	res.sendFile(path.join(__dirname,'Angular','build','index.html'));
})
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
