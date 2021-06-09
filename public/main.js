
const $loginPage = $('.login.page');
const $gamePage = $('.game.page');  

const socket = io();

function hi() {

    $loginPage.fadeOut();
    $gamePage.show();
    socket.on('login', data => {
        console.log(data);
    });
    
}

