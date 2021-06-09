const path = require('path');

const express = require('express');

const mainPage = require('./controller/main-controller');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainPage.mainPage);

const server = app.listen(3000);

const io = require('./socket').init(server);
io.on('connection', socket => {
    console.log('connected!');
})