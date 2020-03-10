import express from "express";
import httpImport from "http";
import socketIO from "socket.io";

const app = express();
const http = httpImport.Server(app);
const io = socketIO(http);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/chatClient.html");
});

let cnt = 1;
io.on("connection", (socket) => { // 사용 접속시 받는 리스너
    console.log("user connected: ", socket.id);

    let name = `user${cnt++}`;
    io.to(socket.id).emit("change name", name);
    io.emit("user connected", name);

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
        io.emit("disconnected user", name);
    });

    socket.on("send message", (userName, text) => {
        let msg = `${userName} : ${text}`;
        console.log(msg);
        io.emit("receive message", msg);
    });

});

http.listen(3000, () => {
    console.log("starting...");
});