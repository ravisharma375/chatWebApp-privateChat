var express = require('express');
var router = express.Router();
var passport = require("passport");
var {User} = require('../config/db')
var auth  = require('../config/auth')
const { Op } = require("sequelize");
var userService=require('../src/service/user')
const {chat} = require("../config/db")
const time=require('../src/service/message');
//get register page
console.log("moment time in indexjs ",time)
router.get('/register',function(req,res){
  res.render("register");
})
//post register
router.post("/register",async function(req,res){
  const {userName , password}=req.body
  const error = []
  console.log(userName,password)
  if(userName == "" || password == ""){

    return res.json({
      error:true,
      message:"missing credential",
      status:false
    })
  }
  if(password.length < 6){

    return res.json({
      error:true,
      message:"Password grater then  6 charater",
      status:false
    })
  }
const findUser  = await User.findOne({
  where:{
    userName:userName
  }
})
if(!findUser){
  const result = await User.create({
    userName:userName,
    password:User.hashPassword(password)
  })
  
  if(result){
    return res.json({
       error:false,
       message:"SuccessFully Register",
       status:true
    })
  }
  else{
    return res.json({
      error:true,
      message:"Internal Server Error",
      status:false
   })
  }
}
return res.json({
  error:true,
  message:"User Allready Exist !",
  status:false
})

})
// GET login /
router.get('/', function(req, res, next) {
  const msg  = req.flash();
  console.log(msg.error);
  res.render("index", {
    loggedOut: "no",
    title: "Login",
    message:msg.error
  });
});
//get login /login
router.get('/Login', function(req, res, next) {
  const msg  = req.flash();
  console.log(msg.error);
  res.render("index", {
    loggedOut: "no",
    title: "Login",
    message:msg.error
  });
});
//post login
//passport auth
router.post('/Login',passport.authenticate('local',{
  successRedirect:'/home',
  failureRedirect:'/Login',
  failureFlash:true,
 
}),(req,res)=>{
  
  const { user } = req;
 
  if(user){
    console.log('You are logged in!');
    sendResponse(0, user.id, res);
    // return res.redirect('http://www.google.com')
    
  }
})
const routes = [
  {
    path: "/home",
  },
];
function sendResponse(roleIndex, userId, res) {

 return res.redirect(routes[roleIndex].path);
}
//logout
router.get('/Logout',function(req,res){
  req.logout();
  const msg  = req.flash();
  console.log(msg.error);
  res.render("index", {
    loggedOut: "no",
    title: "Login",
    message:msg.error
  });
})
//get home page
router.get('/home',auth.ensureAdminAuthenticated,async (req,res)=>{
  const { user } = req;
 const allUser = await User.findAll({
  where:{
    id:{
     [Op.ne]:user.id
    }
    
  }
 })
 console.log(allUser)
 res.render("home", {
currtime:time, 
CURRENTUSER:user,   
USER:allUser
});

})
//post home page
router.post('/home',auth.ensureAdminAuthenticated,(req,res)=>{
  
})
// send message to client from data base
router.post("/chatMessage",auth.ensureAdminAuthenticated,async (req,res)=>{
  //get all message from database 
  const {body} = req
  
  console.log(body)
 
 const result = await chat.findAll({
     where:{
       [Op.or]:[
      {  [Op.and]:[
          { senderId:body.receiver},
          {receiverId:body.sender}
         ],},
         {  [Op.and]:[
          { senderId:body.sender},
          {receiverId:body.receiver}
         ],}
        ]
     }
   })
 
   if(result){
 
return res.json({
  status:"success",
  data:result,
  error:false
})
   }
   return false
 })

module.exports = router;
