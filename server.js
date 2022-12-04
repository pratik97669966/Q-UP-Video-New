import { response } from "express";
import express from "express";
const app = express();
import server  from "http";
const server2=server.Server(app);
import io  from "socket.io";
const io = io(server2);
import { v4 as uuid4 } from "uuid";
import { ExpressPeerServer } from "peer";
const peerServer = ExpressPeerServer(server2, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/peerjs", peerServer);
app.get("/", (req, res) => {
  res.redirect(`/${uuid4()}`);
});
app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server2.listen(process.env.PORT || 3030);
