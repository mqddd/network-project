const path = require('path');

const express = require('express');

const app = express();

const httpServer = require('http').createServer(app);

const mainPage = require('./controller/main-controller');
const { createGame, joinGame, submitCell } = require('./game');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainPage.mainPage);

const io = require('./socket').init(httpServer);    

const rooms = io.of("/").adapter.rooms;


io.on('connection', socket => {
    console.log(socket.id + ' connected!');

    socket.on('create game', () => {
        createGame(socket);
    });

    socket.on('join game', (data) => {
        joinGame(socket, rooms, data);
    });

    socket.on('submit cell', (data) => {
        submitCell(socket, rooms, data);
    });
});

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
  
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

httpServer.listen(3000);
