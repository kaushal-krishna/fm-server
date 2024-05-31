import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 4000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost","http://localhost:3000", "https://flexiyo.web.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: ["http://localhost","http://localhost:3000", "https://flexomate.web.app"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send({
        message: "The server is live...",
    });
});

io.on("connection", (socket) => {
    console.log("Socket Connected :", socket.id);

    socket.on("join-rooms", (roomIds, socketId, username) => {
        roomIds.forEach((roomId) => {
            socket.join(roomId);
        });
        console.log(`${socketId} : User ${username} joined all Rooms`);
    });

    socket.on("send-message", (currentRoomId, socketId, username, message) => {
        console.log({
            currentRoomId,
            socketId,
            username,
            message,
        });
        socket.broadcast.to(currentRoomId).emit("recieve-message", username, message);
        console.log("Socket IDs in room :", Array.from(io.sockets.adapter.rooms.get(currentRoomId) || []));
    });


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
