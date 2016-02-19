var UserMgr = require("../service/users").userMgr;

exports.index = function(req, res){
	res.render('index', {
		error: ""
	});
};

exports.join = function(req, res){
	res.render('join', {
		error: ""
	});
};

exports.chat = function(req, res){
	var userName = req.cookies.playrtc_username;
	var user = UserMgr.getUser(userName);

	res.render('chat', {
		userName: user.getUserName(),
		userNickName: user.getUserNickName()
	});
};


exports.logout = function(req, res){
	res.clearCookie("playrtc_username");
	res.clearCookie("userName");

	res.redirect('/');
};


exports.loginPost = function(req, res){
	var user = UserMgr.getUser(req.body.userName);
	if(user){
		res.cookie('playrtc_username', user.getUserName(),{ expires: new Date(Date.now() + 900000), httpOnly: true });
		res.cookie('playrtc_sessionkey', user.getSessionKey(),{ expires: new Date(Date.now() + 900000), httpOnly: true });
		res.redirect('/chat');
	}
	else{
		res.render('index', {
			error: "존재하지 않는 아이디입니다."
		});
	}
}; 

exports.joinPost = function(req, res){
	if(UserMgr.setUser(req.body)){
		res.redirect('/');
	}
	else{
		res.render('join', {
			error: "이미 존재하고 있는 아이디입니다."
		});
	}
}; 
