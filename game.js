const socket = require('./socket');

const io = socket.getIO();

const users = [];

/* io.emit('login', 'hi'); */