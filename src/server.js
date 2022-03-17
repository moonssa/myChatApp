
import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app=express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname+ "/public"));
app.get("/", (req,res) => res.render("home"));

//const httpServer = http.createServer(app);

const httpServer=http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = wsServer;
  
    const publicRooms = [];
    rooms.forEach((_, key)=> {
      if(sids.get(key) === undefined)
        publicRooms.push(key);
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

const handleListen=()=>{
    console.log("listening on http://localhost:5000");
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {   
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });

    socket.on("enter_room",(roomName, nickName, done)=> {
        socket.join(roomName);
        socket["nickname"] = nickName;
        console.log(socket.rooms);
        console.log(roomName, nickName);
        done();
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
          socket.to(room).emit("bye", socket.nickname, countRoom(room)-1)
        );
    });
    
    socket.on("new_message",(msg, roomName,done)=> {
        socket.to(roomName).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("roomState_change", publicRooms());
    });
    
   
    
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(5000, handleListen);