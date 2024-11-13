const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	service : 'gmail',
	port: 587,
	secure: false,
	requireTLS: true,
	auth : {
		user : process.env.email,
		pass : process.env.pass
	}
});

const formatDateTime = (interview) =>{
	let date = interview.date.getDate() + "/" + (interview.date.getMonth() + 1).toString() + "/" + interview.date.getFullYear();
	let startTime = interview.startTime.getHours() + ":" + (interview.startTime.getMinutes().toString().length === 1 ? "0" + interview.startTime.getMinutes().toString() : interview.startTime.getMinutes().toString());
	let endTime = interview.endTime.getHours() + ":" + (interview.endTime.getMinutes().toString().length === 1 ? "0" + interview.endTime.getMinutes().toString() : interview.endTime.getMinutes().toString());
	return {date : date,startTime : startTime,endTime : endTime};
}

const schedule = (user,interview) => {
	let formatted = formatDateTime(interview);
	let date = formatted.date;
	let startTime = formatted.startTime;
	let endTime = formatted.endTime;

	transporter.sendMail({
		from: process.env.email,
		to: user.email,
		subject: `Invitation : ${user.name} || Interview Round @ ${date} ${startTime} - ${endTime} (IST) (${user.email})`,
		html: `<b>Hi ${user.name},</b> <br/><br/> Greetings !!!<br/>Kindly make yourself for the interview.<br/><br/> Venue : Google Meet <br/> Date : ${date}<br/> Time : ${startTime} - ${endTime}.`
	}, (err, _) => {
		if (err) {
			console.log(err);
			return {error: err};
		}
		return {statusCode: 1, success: true};
	});
}
const updateSchedule = (user,date,startTime,endTime) =>{

	let formatted = formatDateTime({date : date,startTime : startTime,endTime : endTime});
	let fdate = formatted.date;
	let fstartTime = formatted.startTime;
	let fendTime = formatted.endTime;

	transporter.sendMail({
		from : process.env.email,
		to : user.email,
		subject : `Invitation(Revised) : ${user.name} || Interview Round @ ${fdate} ${fstartTime} - ${fendTime}(IST) (${user.email})`,
		html: `<b>Hi ${user.name},</b> <br/><br/> Greetings !!!<br/>Kindly make yourself for the resheduleed interview.<br/> <br/> Venue : Google Meet <br/> Date : ${fdate}<br/> Time : ${fstartTime} - ${fendTime}. </b>`
	},(err,_)=>{
		if(err){
			console.log(err);
			return {error : err};
		}
		return {statusCode : 1,success : true};
	});
}
const deleteSchedule = (user,interview) =>{
	let formatted = formatDateTime(interview);
	let date = formatted.date;
	let startTime = formatted.startTime;
	let endTime = formatted.endTime;

	transporter.sendMail({
		from : process.env.email,
		to : user.email,
		subject: `Interview Scheduled at ${date} ${startTime} - ${endTime} (IST) with (${user.email}) is cancelled.`,
		html: `<b>Hi ${user.name}, <br/><br/> Sorry for the inconvience !!!<br/>Your Interview is cancelled which was scheduled At <br/> Venue : Google Meet <br/> Date : ${date}<br/> Time : ${startTime} - ${endTime}. </b>`
	},(err,_)=>{
		if(err){
			console.log(err);
			return {error : err};
		}
		return {statusCode : 1,success : true};
	});
}

module.exports = {
	schedule,
	updateSchedule,
	deleteSchedule
}
