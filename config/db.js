const {Sequelize} = require('sequelize')
const userModel = require("../src/user/Model/user");
const friendsModel = require("../src/social/Model/friend")
const chatModel = require("../src/social/Model/chat")
// DataBase Config 
//mychat is My dataBsae name if you want to change put your database name
//root is my database username put your database user name
//"" my password is empty put your database Password
const connection=new Sequelize("mychat","root","",{
host:"localhost",
dialect:"mysql",

dialectOptions: {
  useUTC: false, // for reading from database
},
timezone: '+05:30', // for writing to database
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
         friends.belongsTo(User)
         User.hasMany(friends)

         connection
         .sync({ force: false })
         .then(() => {
           console.log("Sequelize running in sync mode");
         })
         .catch(error => {
           throw error;
         });
         
  module.exports={User,friends,chat}