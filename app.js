const path = require('path');

const express = require('express');

const app = express();

const httpServer = require('http').createServer(app);

const mainPage = require('./controller/main-controller');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainPage.mainPage);

const io = require('./socket').init(httpServer);    

let i = 0;

io.on('connection', socket => {
    console.log(socket.id + ' connected!');
    /* const count = io.engine.clientsCount;
    console.log(count); */

    console.log(socket.rooms); // Set { <socket.id> }
    socket.join("room");
    console.log(socket.rooms); 
    i++;
    socket.emit('message', 'hiiii');
    socket.on('disconnect', (reason) => {
        console.log(reason);
    });
    socket.on('name', (data) => {
        console.log(data.data);
    });
});

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
  
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

httpServer.listen(3000);
