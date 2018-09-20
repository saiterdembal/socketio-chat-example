$(document).ready(function() {
  const socket = io.connect("http://localhost:1200");
  const user = {};
  $(".chatPage").hide();

  $("#btnJoin").on("click", () => {
    const username = $("#inputUserName").val();
    const roomName = $("#inputRoomName").val();

    if (username.indexOf(" ") !== -1 && roomName.indexOf(" ") !== -1) {
      alert("username and roomName can not contain spaces");
    } else {
      if (username != undefined && username.length >= 3 &&  roomName != undefined &&
        roomName.length >= 3)
        {
        user.username = username;
        user.id = socket.id;

        $(".userNamePage").fadeOut();
        $(".chatPage").show();
        $(".textArea ul").empty();
        socket.emit("joinRoom", {
          username: user.username,
          roomName: roomName
        });
      } else {
        alert("user name  and roomName must be minimum 3 characters");
      }
    }
  });

  $(" .inputButton").on("click", () => {
    socket.emit("newMessage", {
      message: $(".inputText").val(),
      username: user.username
    });
    $(".inputText").val("");
  });

  $(".messageArea  .inputText").on("keydown", function(event) {
    if (event.which == 13) {
      socket.emit("newMessage", {
        message: $(".inputText").val(),
        username: user.username
      });
    }
  });

  socket.on("broadcastMessage", data => {
    $(".textArea ul").prepend(
      '<li> <span class="userName"><i class="fas fa-angle-right"></i> ' +
        data.username +
        '&nbsp;</span> <span class="text">' +
        data.message +
        "</span></li>"
    );
  });

  socket.on("emitRoom", data => {
    $(".roomInfo").html(
      '<span class="roomName">Room name : </span>' +
        data.roomName +
        '<br/> <span class="userCount"> Connected User : </span> ' +
        data.count
    );
    
    $(".userList").append(
      '<li><i class="fas fa-user"></i>' + data.username + "</li>"
    );

    $(".textArea ul").prepend(
      '<li><i><span class="chatLog"><strong> system : ' +
        data.username +
        "<strong> is connected...</span></i></li>"
    );


  });

  socket.on("emitUser", data => {
    // $(".userList").append(
    //   '<li><i class="fas fa-user"></i>' + data.username + "</li>"
    // );
    
    $(".textAreaLog").html(
      "<span>Welcome <strong>" +
        data.username +
        '</strong>. <i> Please click for <a href="">chat rules</a></i></span>'
    );
  });

  socket.on("broadcastUser", data => {
 
  });

  socket.on("selfMessage", data => {
    $(".textArea ul").prepend(
      '<li> <span class="userName"><i class="fas fa-angle-right"></i> ' +
        data.username +
        '&nbsp;</span> <span class="text">' +
        data.message +
        "</span></li>"
    );

    $(".inputText").val("");
  });
  
});
