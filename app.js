var express=require('express'),
	app=express(),
	socket=require('socket.io'),
	bodyParser=require('body-parser'),
	mongoose=require('mongoose'),
	passport=require('passport'),
	localStrategy=require('passport-local'),
	passportLocalMongoose=require('passport-local-mongoose'),
	user=require('./models/user');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
//setting mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/chat_app');
app.use(express.static('public'));
let onlineuser=[];
//configuring passport
app.use(require("express-session")({
    secret: "Hi I am Aniruddha",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//chat pages
app.get('/',(req,res)=>{
	res.render('index');
});
app.get('/home',isLoggedIn,(req,res)=>{
	
	res.render('chat',{user:req.user});
});
app.get('/personal/:sender/:receiver',isLoggedIn,(req,res)=>{
	let sender=req.params.sender;
	let receiver=req.params.receiver;
	var data={sender:sender,rec:receiver,user:req.user};
	res.render('personal',{data:data});
});

//setting auth routes
app.get('/auth/register',(req,res)=>{
		   res.render('register');
});
app.post('/register',(req,res)=>{
	user.register(new user({username:req.body.username}),req.body.password,(err,user)=>{
		
		if(err){
			console.log(err);
			return res.redirect('/auth/register');
}
		console.log(user);
		passport.authenticate("local")(req, res, function(){
           res.redirect('/home');
        });
	});
});
app.get('/auth/login',(req,res)=>{
	res.render('login');
});
app.post('/login',passport.authenticate('local',{
	
	failureRedirect:'/auth/login'
}),(req,res)=>{
	res.redirect('/home');
});
app.get('/auth/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});
//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
}
	res.redirect('/auth/login');
}
//socket codes
var server=app.listen(3000,()=>{
	console.log('server is running');
});
var io=socket(server);
io.on('connection',function(socket){
	
	socket.on('userid',(data)=>{
		user.findOne({_id:data},(err,user)=>{
					 if(err){
			console.log(err);
		}
		else{
			var x=user._id;
	onlineuser.push({[x]:{
		username:user.username,
		socket:socket.id
	}})	;
			console.log("new user added");
			console.log(onlineuser);
			io.sockets.emit('online',onlineuser);
}
});
		
});
	socket.on('chat',function(data){
		
		io.sockets.emit('chat',data);
	});
	socket.on('typing',(data)=>{
		socket.broadcast.emit('typing',data);
});
// 	socket.on('private',(
// data)=>{
// 		var index=onlineuser.findIndex((ele)=>{
// 			return ele._id==data.id;
// 		});
// 		console.log(index);
// 		if(index!=-1){
// 			var to=onlineuser[index].socket;
// 		io.to(`${to}`).emit('private',"hello");
// 		}		
// 	});
	socket.on('personal',(data)=>{
		console.log(data);
			var to=onlineuser[data].socket;
		io.to(`${to}`).emit('personal',data);
		
		
});
	socket.on('disconnect',()=>{
		var index=onlineuser.findIndex((ele)=>{
			ele.socket=socket.id;
		
});
		onlineuser.splice(index,1);
		io.sockets.emit('online',onlineuser);
		
	});
});