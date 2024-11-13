const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true
		// unique : true
	},
	interviews : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Interview'
		}
	]
},{timestamps : true});

const user = mongoose.model('User',userSchema);
module.exports = user;
