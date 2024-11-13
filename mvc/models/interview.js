const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema({
	date :{
		type : Date
	},
	startTime : {
		type : Date
	},
	endTime : {
		type : Date
	},
	users : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : 'User'
		}
	]
},{timestamps : true});

const interview = mongoose.model('Interview',interviewSchema);
module.exports = interview;
