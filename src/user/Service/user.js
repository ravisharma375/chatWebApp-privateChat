var {User} = require('../../../config/db');
var {friends} = require('../../../config/db');
var {chat} = require('../../../config/db');
const { Op } = require("sequelize");
const { all } = require('../../../routes');
class userService {
    static async getAllUser(UserID){
try{
    const user = await User.findAll({
        where:{
    [Op.ne]:{
            id:UserID
             }
        }
    })
if(user){
    return user
}
return false
}catch(err){
    throw err
}
 
    }
    static async getUserChat(body){
            try{
                const allChat = await chat.findAll({
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
                if(allChat){
                    return allChat
                }
                return false
            }
            catch(err){
                throw err
            }
    }
    static async getUserFriends(){}
    
}
module.exports=userService