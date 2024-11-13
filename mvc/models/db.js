const mongoose = require('mongoose');
let uri = 'mongodb://localhost/InterviewScheduler';

if (process.env.NODE_ENV === 'PRODUCTION') {
	uri = process.env.url;
}
mongoose.connect(uri).then(()=>{
		console.log("Mongoose Connected");
	}
).catch((err)=>{
	console.log(`Mongoose connection error: ${err}`);
});

const gracefulShutdown = (msg, callback) => {
	mongoose.connection.close( () => {
		console.log(`Mongoose disconnected through ${msg}`);
		callback();
	});
};

process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart', () => {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', () => {
	gracefulShutdown('app termination', () => {
		process.exit(0);
	});
});

process.on('SIGTERM', () => {
	gracefulShutdown('Heroku app shutdown', () => {
		process.exit(0);
	});
});
