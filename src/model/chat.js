module.exports = (connection,dataType) =>{
    const chat = connection.define("chat",{
        id:{
            type:dataType.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        senderId:{
            type:dataType.STRING,

        },
        receiverId:{
            type:dataType.STRING,
        },
        messages:{
            type:dataType.STRING,
        },
        msgTime:{
            type:dataType.STRING,
        }
    })
    return chat
}