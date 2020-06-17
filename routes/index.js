var express = require('express');
var router = express.Router();
var passport = require("passport");
var {User} = require('../config/db')
var auth  = require('../config/auth')
const { Op } = require("sequelize");
var userService=require('../src/service/user')
const {chat} = require("../config/db")
const time=require('../src/service/message');
const multer = require("multer")
const mkdir = require("mkdirp");
const fs = require("fs")
const dir  = "./public/uploads"
if(!fs.existsSync(dir)){
  fs.mkdirSync(dir)
}
//file upload 
// SET STORAGE

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
//check file type multer
function checkFileType(file, cb) {
  // Allowed ext
  // Allowed extlicenseFile
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb("Error: Images Only (jpg,png)!", false);
}

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
  successRedirect:'/homee',
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
    path: "/homee",
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
router.get('/homee',auth.ensureAdminAuthenticated,async (req,res)=>{
  const { user } = req;
 const allUser = await User.findAll({
  where:{
    id:{
     [Op.ne]:user.id
    }
    
  }
 })
 console.log(allUser)
 res.render("homee", {
currtime:time, 
CURRENTUSER:user,   
USER:allUser
});

})
//post home page
router.post('/homee',auth.ensureAdminAuthenticated,(req,res)=>{
  
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
//file upload using multer
router.post('/uploadfile',async (req, res, next) => {
  const date = new Date();
  const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
  const file = req.body.base64;

  const ext = req.body.ext;
  const fileBuffer = Buffer.from(file, "base64");
      const base = "public/";
      const dir = `uploads/${year}/${month}/${day}/`
      const path = base + dir;
      if (!fs.existsSync(path)) {
        await mkdir(path);
      }
      const fileName = `file_${Math.floor(100 + Math.random() * 9000000)}.${ext}`;
      await fs.writeFileSync(path + fileName, fileBuffer, "utf8");
      return res.status(200).send({
        status: "success",
        data: {
          message: "File Uploaded Successfully!",
          filePath: dir + fileName,
        },
      });
    })
module.exports = router;
