function randomKey(){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for(var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	
	return randomstring;
}


function User(user){
	console.log(user.userNickName);
	this.userName = user.userName;
	this.userPwd = user.userPwd;
	this.userNickName = user.userNickName;
	this.sessionkey = randomKey();
}

(function(_){
	_.getSessionKey = function(){
		return this.sessionkey;
	};
	_.getUserName = function(){
		return this.userName;
	};
	_.getUserNickName = function(){
		return this.userNickName;
	};
})(User.prototype);

var UserManager = {
	users: { },
	getUser: function(userName){
		return this.users[userName];
	},
	setUser: function(user){
		if(!this.getUser(user.userName)){
			this.users[user.userName] = new User(user);
			return true;
		}
		return false;
	}
};

exports.userMgr = UserManager;