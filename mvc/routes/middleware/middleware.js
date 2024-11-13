const apiGuard = (req,res,next)=>{
	if (req.get('host')!=="localhost:3000"){
		res.json({ error : "Can't Create Fake Users in production mode." })
	}else {
		next();
	}
}

module.exports = {
	apiGuard
}
