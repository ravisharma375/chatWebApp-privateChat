var moment = require('moment');
function massageFormat(userName,text){
return {
    userName,
    text,
    time:moment().format('h:mm a')
}
}
module.exports=massageFormat