const path = require('path');

const express = require('express');

const mainPage = require('./controller/main-controller');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainPage.mainPage);

app.listen(3000);