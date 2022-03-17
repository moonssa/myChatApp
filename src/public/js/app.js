const socket=io();
let roomName, nickName;

const welcome = document.getElementById("welcome");
const loginForm = document.getElementById("login-form");
const msgroom = document.getElementById("room");

msgroom.hidden = true;

function addMessage(msg) {
    const ul = msgroom.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = msgroom.querySelector("input");
    console.log(input.value);
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    msgroom.hidden = false;
    console.log("app excuted");
    const msgForm = document.getElementById("msg-form");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const inputNickname = loginForm.querySelector("#nickname");
    const inputRoomname = loginForm.querySelector("#roomname");
    roomName = inputRoomname.value;
    nickName = inputNickname.value;
   
    socket.emit("enter_room", roomName, nickName, showRoom);
    inputRoomname.value="";
    inputNickname.value="";
}

loginForm.addEventListener("submit", handleLoginSubmit);

socket.on("welcome", (user, newCount) => {
    h3 = room.querySelector("h3");
    h3.innerText = `Room :  ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
  });
  
socket.on("bye", (user, newCount) => {
    h3 = room.querySelector("h3");
    h3.innerText = `Room :  ${roomName} (${newCount})`;
    addMessage(`${user} left ㅠㅠ`);
  });
socket.on("new_message", addMessage);

socket.on("roomState_change", (rooms)=> {
    const roomList = document.querySelector("#roomList ul");
    roomList.innerHTML="";
    rooms.forEach((room) => {
      const li = document.createElement("li");
      li.innerText = room;
      roomList.append(li);
    });
});