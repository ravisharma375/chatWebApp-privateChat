const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const messageFormat=require('./src/service/message');
const passport = require("passport");
//var io = require('socket.io')(server);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require("express-session");
const flash = require("connect-flash");
const {friends} = require("./config/db")
const {chat} = require("./config/db")
const bodyparser  =  require("body-parser")
var moment = require("moment")
var app = express();
var soc_io = require('socket.io');
var io=soc_io()
app.io=io

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



 app.use(flash());
const auth = require("./config/auth");

auth.serializeUser();
auth.deserializeUser();
auth.configureStrategy();
app.use(session({
  secret: 'L^m&SApi%Jk%t',
  resave: false,
  saveUninitialized: false,
 
}))
app.use(passport.initialize());
app.use(passport.session());
//call all api in MVC Pattern




app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//body parser
//app.use(bodyparser.urlencoded())
// enable header for post request
app.use(function(req,res,next){
  res.setHeader();
  next()
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
   
  res.render('error');
});


const chatBot = "chatBot"
// store user in array
var users=[]
var currtime = moment().format('h:mm a')
//creating socket io  instance
io.on("connection",(socket)=>{
  //checking socket connected or not
  console.log("user Connecterd",socket.id)
  // incomming user 
  socket.on("user-connected",(username)=>{
    users[username] = socket.id
    console.log(username)
    //notify all connected user
    io.emit("user-connected",username)
   
  })
  //listen from client
  socket.on("send-message",(data)=>{
    //send event to reciver 
 
    var socketId = users[data.receiver]

    //send to client and only to reciver
    if (io.sockets.connected[socketId]) {
      console.log(`sender ${data.sender} and receiver ${data.receiver} connected`)
      io.sockets.connected[socketId].emit('new-message',data,currtime);
     //save Message in DataBase in chat Table
      chat.create({
        senderId:data.sender,
        receiverId:data.receiver,
       messages:data.message
})
  }
    // io.to(socketId).emit("new-message",data)
  })
})
//  io.on('connection', (socket) => {
//   console.log('a user connected');
//   //socket join
//   socket.on("join", function(sender, receiver) {
//     console.log(`${sender} : has started the chat with ${receiver}`);
//   });
//   //for all user
//    socket.emit("msg",messageFormat(chatBot,` welcome to chat`))
// //for new user 
// socket.broadcast.emit("msg",messageFormat(chatBot,``));
// socket.on('chat-msg',msg  => {
//   io.emit("msg",messageFormat(chatBot,msg))
//   console.log(msg)
// })
//   socket.on('disconnect', () => {
//     console.log('user disconnected');                                                        
//   });
// });
module.exports = app;
