
const $loginPage = $('.login.page');
const $gamePage = $('.game.page');  
const $usernameInput = $('.usernameInput');

const socket = io();

function hi() {
    $loginPage.fadeOut();
    $gamePage.show();
    socket.emit('name', {data: $usernameInput.val()}); 
}

socket.on('message', (data) => {
    console.log(data);
});
  