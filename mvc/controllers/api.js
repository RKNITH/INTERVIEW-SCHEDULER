const Interview = require('../models/interview');
const User = require('../models/user');
const Mail = require('../mails/mails');
const {use} = require("express/lib/router");

const getAllInterviews = async (req,res)=>{
	try {
		let interviews = await Interview.find({}).populate('users');
		return res.statusJson(200, {interviews: interviews});
	}catch (err){
		return res.json({error : err});
	}
}
const createInterview = async ({body}, res) => {
	const ids = body.ids;
	if (ids.length < 2) {
		return res.json({error: "Number of participants is less than 2"});
	}
	const date = Date.parse(body.date.toString());
	const startTime = Date.parse(body.startTime.toString());
	const endTime = Date.parse(body.endTime.toString());

	if (startTime > endTime) {
		return res.json({error: "Invalid Time"});
	}
	let today = new Date(Date.now());
	today = today.getDate() + "/" + (today.getMonth() + 1).toString() + "/" + today.getFullYear();
	if(date < Date.parse(today.toString())){
		return res.json({error : "Invalid Date"});
	}
	for (let id of ids) {
		const info = await User.findOne({_id: id}).populate('interviews');
		if (info) {
			let interviews = info.interviews;
			for (let interview of interviews) {
				if (Date.parse(interview.date.toString()) === date) {
					if (!(endTime <= Date.parse(interview.startTime.toString()) || startTime >= Date.parse(interview.endTime.toString()))) {
						return res.json({error: `Couldn't create Interview for ${info.name}. ${info.name} already having an interview at that time.`});
					}
				}
			}
		}
	}
	const interview = await Interview.create({date : new Date(date),startTime : new Date(startTime),endTime : new Date(endTime)});
	if(interview) {
		for (let id of ids) {
			const info = await User.findOne({_id : id});
			if (info) {
				info.interviews.push(interview);
				info.save();
				interview.users.push(info);
				Mail.schedule(info,interview);
			}
		}
		interview.save()
	}
	return res.statusJson(201, {message: "Successfully created Interview."});
}
const updateInterview = async ({body,params},res)=>{
	try{
		const interview = await Interview.findOne({_id : params.id});
		const ids = body.ids;

		if(ids.length < 2){
			return res.json({error : "Number of participants is less than 2"});
		}
		const date = Date.parse(body.date.toString());
		const startTime = Date.parse(body.startTime.toString());
		const endTime = Date.parse(body.endTime.toString());

		if(startTime > endTime){
			return res.json({error : "Invalid Time"});
		}
		let today = new Date(Date.now());
		today = today.getDate() + "/" + (today.getMonth() + 1).toString() + "/" + today.getFullYear();

		if(date < Date.parse(today.toString())){
			return res.json({error : "Invalid Date"});
		}

		if(interview) {
			let userID;
			for (userID of ids) {
				const user = await User.findOne({_id : userID});
				if(user) {
					const index = user.interviews.indexOf(interview.id);
					if (index !== -1) {
						user.interviews.splice(index, 1);
						user.save();
					}
				}
			}
			interview.users.splice(0, userID.length);
		}
		for (let id of ids){
			const info = await User.findOne({_id : id}).populate('interviews');
			if (info) {
				let interviews = info.interviews;
				for (let interview of interviews) {
					if (Date.parse(interview.date.toString()) === date) {
						if (!(endTime <= Date.parse(interview.startTime.toString()) || startTime >= Date.parse(interview.endTime.toString()))) {
							return res.json({error: `Couldn't create Interview for ${info.name}. User already having an interview at that time.`});
						}
					}
				}
			}
		}
		if(interview) {
			for (let id of ids) {
				const user = await User.findOne({_id: id});
				if (user) {
					user.interviews.push(interview);
					user.save();
					interview.users.push(user);
					Mail.updateSchedule(user,date,startTime,endTime);
				}
			}
			interview.date = new Date(date);
			interview.startTime = new Date(startTime);
			interview.endTime = new Date(endTime);

			interview.save();
		}
		return res.statusJson(204,{message : "Successfully updated Interview"});
	}catch (err){
		return res.json({statusCode : 500,error : err});
	}
}
const deleteInterview = async ({params},res) => {
	try {
		const id = params.id;
		let interview = await Interview.findOne({_id: id});
		if (interview) {
			for (let userID of interview.users) {
				const user = await User.findOne({_id: userID});
				if (user) {
					const index = user.interviews.indexOf(interview._id);
					if (index !== -1) {
						Mail.deleteSchedule(user,interview);
						user.interviews.splice(index, 1);
						user.save();
					}
				}
			}
			interview.remove();
		}
		return res.statusJson(200, {message: "Successfully deleted Interview."})
	}catch (err){
		return res.json({error: err});
	}
}

module.exports = {
	getAllInterviews,
	createInterview,
	updateInterview,
	deleteInterview
}
