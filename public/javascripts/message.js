const chatForm=document.getElementById('chat-form')
var currtimenow=document.getElementById("currtime").value
//message id array
var listofmessage  = []
var socket = io();
//type of message
var type ="text"
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
    document.getElementById("chatHead").innerHTML = username
    console.log("FUNCTION CALL",username)
    //call  an ajax to retrive previous message
   
    return false
}
//send message 
function sendMessage(){
  var message =  document.getElementById("message").value
  var msg = message.trim()
  console.log("Empty",message)
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
        message:message,
        time:currtimenow,
        type            //----------------text
    })
    var html = ``;
    // html +="<li class='replies text-left bg-dark text-white'><p>"+"you"+"say"+message+"</p></li>"
     html += `<div class="row message-body">
     <div class="col-sm-12 message-main-sender">
       <div class="sender">
         <div class="message-text">
          ${message}
         </div>
         <span class="message-time pull-right">
           ${currtimenow}
         </span>
       </div>
     </div>
   </div>`
    document.getElementById("conversation").innerHTML+=html
    document.getElementById("message").value  = ""
}
  return false
  
}
//listen from server
socket.on("new-message",(data,currtime)=>{
  
console.log(data.message)
  var html = ``;
  //html +="<li class='sent text-right bg-success text-white'><p>"+data.sender+"say"+data.message+"</p></li>"
  html += `<div class="row message-body">
  <div class="col-sm-12 message-main-receiver">
    <div class="receiver">
      <div class="message-text">
      ${data.type=="file"?`<img src="${data.message}" alt="loading.." class="img-thumbnail">`:data.message}
      </div>
      <span class="message-time pull-right">
      ${currtime}
      </span>
    </div>
  </div>
</div>`
  document.getElementById("conversation").innerHTML+=html
  
console.log(data,"hello new mesage")
})

//jquery to disable and enable input tag
$(document).ready(function(){


  $('#message').prop("disabled", true);
  
    $(".agree").click(function(){
      console.log("click me")
      $("#message").prop("disabled", false);
      $("#conversation").empty() 

      console.log("chat clear")
       $.ajax({
          type:"POST",
          url:"/chatMessage",
         data:{
            sender:sender,
            receiver:receiver,
          },
          success:function(response){
            console.log(response)
            const msg = response.data
            msg.forEach(x=>{

              // consol)e.log(x.senderId,sender)
              // console.log(x.receiverId,receiver)
              // console.log(x.messages)
              // con`sole.log(x.id)
              // listofmessage.push(x.id)
              // console.log(listofmessage)
              if(x.receiverId == receiver){
                console.log("if")
                var html = ``;
                html +=`<div class="row message-body">
                <div class="col-sm-12 message-main-sender">
                  <div class="sender">
                    <div class="message-text">
                    ${x.type=="file"?`<img src="${x.messages}" alt="loading.." class="img-thumbnail">`:x.messages}
                    
                    </div>
                    <span class="message-time pull-right">
                    ${x.msgTime}
                    </span>
                  </div>
                </div>
              </div>`
                document.getElementById("conversation").innerHTML+=html
              }else{
                console.log("else")
                var html = ``;
                html +=`<div class="row message-body">
                <div class="col-sm-12 message-main-receiver">
                  <div class="receiver">
                    <div class="message-text">
                    ${x.type=="file"?`<img src="${x.messages}" alt="loading.." class="img-thumbnail">`:x.messages}
                   </div>
                    <span class="message-time pull-right">
                    ${x.msgTime}
                    </span>
                  </div>
                </div>
              </div>`
                document.getElementById("conversation").innerHTML+=html
              }
            })
          }
        })
        if($(this).prop("checked") == true){
         $("#message").prop("disabled", false);
         console.log("click me")
        }
        else if($(this).prop("checked") == false){
          console.log("redio is uncheck")
 
          $("#messages-user").empty()

          $('#message').prop("disabled", true);
          return true
         }
    });

    if (window.matchMedia('(max-width: 700px)').matches)

    {
      var des = document.getElementById("Desktop");
      des.remove();
      
      // $("#Desktop").css("display", "none");
      // $("#Mobile").css("display", "block");
      // do functionality on screens smaller than 768px
    var userList = $('.agree');
    var messages = $('.side-two-sec');
    var close = $('.close');
    
    userList.on('click', function(){
      $("#side-one").css({"display": "none",});
      $(this).addClass('active');
      messages.addClass('active');
    });
    
    close.on('click', function(){
      $("#side-one").css({"display": "block",});
      messages.removeClass('active');
      userList.removeClass('active');
    });



    }
    else{
      // $("#Mobile").css("display", "none");
      // $("#Desktop").css("display", "block");
      var mob = document.getElementById("Mobile");
      mob.remove();
    }

  });
//scroll jquery code referance from metrialize

   

async function convertBase64(element){
  const file = element.files[0];
  console.log(file)
  
  const reader =  new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () =>{
    
    const getext = (file.type).split("/");
    const ext = getext[1];

    console.log(ext)
   const dataURL= reader.result
   const base64=dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
  $.ajax({
    type:"POST",
    url:"/uploadfile",
   data:{
    base64:base64,
    ext:ext,
    },
    success:function(response){
console.log(response.data.filePath)
var filePath  = response.data.filePath
//send file to server using socket io
    //send message to server
    console.log(message,"hello")
    socket.emit("send-message",{
        sender:sender,
        receiver:receiver,
        message:filePath,
        time:currtimenow,
        type:"file"            //----------------file
    })
    var html = ``;
    // html +="<li class='replies text-left bg-dark text-white'><p>"+"you"+"say"+message+"</p></li>"
     html += `<div class="row message-body">
     <div class="col-sm-12 message-main-sender">
       <div class="sender">
         <div class="message-text">
         <img src="${filePath}" alt="loading.." class="img-thumbnail">
        
          </div>
         <span class="message-time pull-right">
           ${currtimenow}
         </span>
       </div>
     </div>
   </div>`
   document.getElementById("conversation").innerHTML+=html
   document.getElementById("message").value  = ""
   //end
    }
   })
   
   return base64
  }
  
 }