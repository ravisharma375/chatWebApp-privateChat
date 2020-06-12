
const bcrypt = require('bcrypt');
module.exports=function(connection,dataType){
    const User=connection.define("users",{
        id:{
            type:dataType.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        userName:{
            type:dataType.STRING,
        },
        password:{
            type:dataType.STRING,
        }

    })
  
    User.hashPassword = function(password) {
        return bcrypt.hashSync(password, 10);
      }
   
    
    User.prototype.validatePassword = function(password) {
 return  bcrypt.compareSync(password, this.password);;
    }
  
 
    return User;
}