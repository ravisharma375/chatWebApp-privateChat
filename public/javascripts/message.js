const chatForm=document.getElementById('chat-form')
var currtimenow=document.getElementById("currtime").value
//message id array
var listofmessage  = []
var socket = io();
//global variable for reciver
var receiver=``;
//glogbal variable for sender
var sender = ``;
//send to server
var userName = document.getElementById("CURRENTUSER").value
socket.emit("user-connected",(userName))
//save sender name in global user
sender = userName
//listen from server userName
socket.on("user-connected", (username) =>{
console.log("new user ", username)

})
function onUserSelected(username){
    receiver=username
    //call  an ajax to retrive previous message
   
    return false
}
//send message 
function sendMessage(){
  var message =  document.getElementById("message").value
  var msg = message.trim()
  if(msg==""){
console.log("Empty",message)
document.getElementById("message").value  = ""
  }
else{
    //send message to server
    console.log(message,"hello")
    socket.emit("send-message",{
        sender:sender,
        receiver:receiver,
        message:message
    })
    var html = ``;
    // html +="<li class='replies text-left bg-dark text-white'><p>"+"you"+"say"+message+"</p></li>"
     html += `<li class="sent">
     <div class="container lime lighten-3">
       <p>${message}</p>
       <span class="time-right black-text">${currtimenow}</span>
     </div>
    </li>`
    document.getElementById("messages-user").innerHTML+=html
    document.getElementById("message").value  = ""
}
  return false
  
}
//listen from server
socket.on("new-message",(data,currtime)=>{

  var html = ``;
  //html +="<li class='sent text-right bg-success text-white'><p>"+data.sender+"say"+data.message+"</p></li>"
  html += `<li class="replies">
  <div class="container darker green lighten-1">
    <p>${data.message}</p>
   <span class="time-left black-text">${currtime}</span>
 </div>
</li>`
  document.getElementById("messages-user").innerHTML+=html
  
console.log(data,"hello new mesage")
})

//jquery to disable and enable input tag
$(document).ready(function(){
  alert("click on the user  check box   to start the chat")
  $('#message').prop("disabled", true);
   
    $("#agree").click(function(){
  
        if($(this).prop("checked") == true){
          
         $("#message").prop("disabled", false);
         $.ajax({
          type:"POST",
          url:"/chatMessage",
         data:{
            sender:sender,
            receiver:receiver,
          },
          success:function(response){
            
            const msg = response.data
            msg.forEach(x=>{
              // console.log(x.senderId,sender)
              // console.log(x.receiverId,receiver)
              // console.log(x.messages)
              // console.log(x.id)
              // listofmessage.push(x.id)
              // console.log(listofmessage)
              if(x.receiverId == receiver){
                console.log("if")
                var html = ``;
                html +=`<li class="sent">
                <div class="container lime lighten-3">
                  <p>${x.messages}</p>
                  <span class="time-right black-text">11:00</span>
                </div>
               </li>`
                document.getElementById("messages-user").innerHTML+=html
              }else{
                console.log("else")
                var html = ``;
                html +=`<li class="replies">
                <div class="container darker green lighten-1">
                  <p>${x.messages}</p>
                 <span class="time-left black-text">11:01</span>
               </div>
              </li>`
                document.getElementById("messages-user").innerHTML+=html
              }
            })
          }
        })
        }
        else if($(this).prop("checked") == false){
          console.log("checkbox is uncheck")
          $("#messages-user").empty()
          $('#message').prop("disabled", true);
         }
    });
});
//scroll jquery code referance from metrialize
$(document).ready(function(){
  $('.scrollspy').scrollSpy();
});