const express = require("express");
const app = express();
const http = require("http")
const cors = require("cors");

const { Server } = require("socket.io");

const server = http.createServer(app);

app.use(cors());

let elements = []

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log('User connected');
    io.to(socket.id).emit('whiteboard-state', elements);

    socket.on('element-update', (elementData) => {
        updateElements(elementData)
        socket.broadcast.emit('element-update', elementData);
    })
    socket.on('whiteboard-clear', () => {
        elements = [];
        socket.broadcast.emit('whiteboard-clear');
    })
    socket.on('cursor-position', (cursorData) => {
        socket.broadcast.emit('cursor-position', {
            ...cursorData,
            userId: socket.id,
        });
        socket.on('disconnected', (cursorData) => {
            socket.broadcast.emit('user-disconnected', socket.id)
        });
    })
})


app.get("/", (req, res) => {
    res.send("Hello, server!");
})

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

const updateElements = (elementData) => {
    const index = elements.findIndex((element) => element.id === elementData.id);
    if (index === -1) return elements.push(elementData);

    elements[index] = elementData;
}