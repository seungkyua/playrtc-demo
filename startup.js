var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , UserMgr = require("./service/users").userMgr
  , port = process.env.PORT || 8888;



var app = express();

// all environments
app.set('port', port);
app.set('views', __dirname + '/samples');
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', require('hogan-express'));
app.enable('view cache');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'resources')));

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Content-Length');
    
    if ('OPTIONS' === req.method) {
    	res.send(200);
	}
	else{
		next();
	}
});

// development only
// if ('development' === app.get('env')) {
  app.use(express.errorHandler());
// }


function loginCheck(req, res, next) {
	if(req.path === "/chat"){
		var userName = req.cookies.playrtc_username;
		var sessionkey = req.cookies.playrtc_sessionkey;
		if(userName && sessionkey){
			var user = UserMgr.getUser(userName);
			if(!user){
				res.redirect("/");
			}
			else if(user.getUserName() === userName && user.getSessionKey() === sessionkey){
				next();
			}
			else{
				res.redirect("/");
			}
		}
		else{
			res.redirect("/");
		}
	}
	else{
		next();
	}
}

// static resource url mapping
app.get('/', loginCheck, routes.index);
app.get('/join', loginCheck, routes.join);
app.get('/chat', loginCheck, routes.chat);
app.get('/logout', loginCheck, routes.logout);

app.post('/', loginCheck, routes.loginPost);
app.post('/join', loginCheck, routes.joinPost);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


