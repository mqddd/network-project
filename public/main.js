
const $loginPage = $('.login.page');
const $gamePage = $('.game.page');  

const socket = io("ws://localhost:3000");

function hi() {

    $loginPage.fadeOut();
    $gamePage.show();
    /* socket.on('login', data => {
        console.log(data);
    }); */

    
    
}


socket.on('message', (data) => {
    console.log('data');
    console.log(data);
});