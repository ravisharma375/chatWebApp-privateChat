module.exports=(connection,dataType)=>{
    const friend=connection.define("friends",{
        id:{
            type:dataType.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        senderId:{
            type:dataType.INTEGER
        },
        receiverId:{
            type:dataType.INTEGER
        },
        status:{
            type:dataType.INTEGER
        }
    })
    return friend
}