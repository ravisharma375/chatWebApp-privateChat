const {Sequelize}=require('sequelize')
const userModel=require("../src/model/user");
const friendsModel=require("../src/model/friend")
const chatModel = require("../src/model/chat")
const connection=new Sequelize("mychat","root","",{
host:"localhost",
dialect:"mysql"
})


connection.authenticate().then(x=>{
            console.log('Connection has been established successfully.');
         }).catch (error=>
            {
                console.error('Unable to connect to the database:', error);
              
         }) 
         //pass Sequelize argment 
         const User = userModel(connection,Sequelize);    
         const friends = friendsModel(connection,Sequelize);    
         const chat = chatModel(connection,Sequelize)

         connection
         .sync({ force: false })
         .then(() => {
           console.log("Sequelize running in sync mode");
         })
         .catch(error => {
           throw error;
         });
  module.exports={User,friends,chat}