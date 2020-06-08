var {User}=require('../../config/db');
var {friends}=require('../../config/db');
class userService {
    static async getAllUser(){
        try{
const allUser=await User.findAll();
const friend = await friends.findAll({
    where:{
        senderId:1,}
})
allUser.forEach(function(x){
    console.log(x.dataValues.id)
  
})
if(allUser){
    return allUser
}
else{
    return false 
}
        }
        catch {
return false
        }
    }
}
module.exports=userService