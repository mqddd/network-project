const $loginPage = $('.login.page');
const $gamePage = $('.game.page');  
const $gameId = $('.usernameInput');
const $cells = $('.cell');
const $static_game_id = $('.game-id');
const $creator_score = $('.creator-score');
const $opponent_score = $('.opponent-score');
const $submit = $('.submit');
const $failure_join = $('.failure-join');
const $invalid_input = $('.invalid-input');
const $winner_sign = $('.winner-sign');



const socket = io();

function createGame() {
    socket.emit('create game');
}

function joinGame() {
    const id = $gameId.val();
    socket.emit('join game', {data: id}); 
}

function submitCell() {
    let board = "";
    let flag = true;
    for (let i = 0; i < 81; i++) {
        if (($cells.eq(i).val() > 0 && $cells.eq(i).val() < 10)) {
            board += $cells.eq(i).val();   
        } else if ($cells.eq(i).val() === '') {
            board += '.';
        } 
        else {
            $invalid_input.text('input is invalid!');
            flag = false;
            break;
        }
    }
    if (flag) {
        $invalid_input.text('');
        const id = $static_game_id.text().substring(9);
        socket.emit('submit cell', {board: board, id: id});   
    }
}

socket.on('successful create', (data) => {
    $loginPage.fadeOut();
    $gamePage.show();
    for (let i = 0; i < 81; i++) {
        if (data.board.charAt(i) !== '.') {
            $cells.eq(i).val(data.board.charAt(i));
            $cells.eq(i).attr('disabled', 'true');
        }
    }
    $submit.hide();
    $static_game_id.text('game id: ' + data.room_id);
    $creator_score.text('game creator score: ' + data.creator_score);
    $opponent_score.text('joined person score: 0');
});

socket.on('successful join', (data) => {
    if (socket.id === data.creator) {
        $submit.show();
    } else {
        $loginPage.fadeOut();
        $gamePage.show();
        for (let i = 0; i < 81; i++) {
            if (data.board.charAt(i) !== '.') {
                $cells.eq(i).val(data.board.charAt(i));
                $cells.eq(i).attr('disabled', 'true');
            }
        }
        $static_game_id.text('game id: ' + data.room_id);
        $creator_score.text('game creator score: ' + data.creator_score);
        $opponent_score.text('joined person score: ' + data.opponent_score);
        $submit.hide();
    }
});

socket.on('failure join', (data) => {
    $failure_join.text(data.reason);
});
  
socket.on('submit answer', (data) => {
    if (data.turn && socket.id == data.creator) {
        $creator_score.text('game creator score: ' + data.creator_score);
        $opponent_score.text('joined person score: ' + data.opponent_score);
        for (let i = 0; i < 81; i++) {
            if (data.new_board.charAt(i) !== '.') {
                $cells.eq(i).val(data.new_board.charAt(i));
                $cells.eq(i).attr('disabled', 'true');
            } else {
                $cells.eq(i).val('');
            }
        }
        if (data.winner !== '') {
            if (data.winner === 'creator') {
                $winner_sign.text('game creator won the game!');
            } else if (data.winner === 'joined') {
                $winner_sign.text('joined person won the game!');
            } else {
                $winner_sign.text('the game is draw!');
            }
            $submit.hide();
        } else {
            $submit.show();
        }
    } else if (!data.turn && socket.id == data.creator) {
        $creator_score.text('game creator score: ' + data.creator_score);
        $opponent_score.text('joined person score: ' + data.opponent_score);
        for (let i = 0; i < 81; i++) {
            if (data.new_board.charAt(i) !== '.') {
                $cells.eq(i).val(data.new_board.charAt(i));
                $cells.eq(i).attr('disabled', 'true');
            } else {
                $cells.eq(i).val('');
            }
        }
        if (data.winner !== '') {
            if (data.winner === 'creator') {
                $winner_sign.text('game creator won the game!');
            } else if (data.winner === 'joined') {
                $winner_sign.text('joined person won the game!');
            } else {
                $winner_sign.text('the game is draw!');
            }
            $submit.hide();
        } else {
            $submit.hide();
        }
    } else if (data.turn && socket.id == data.opponent) {
        $creator_score.text('game creator score: ' + data.creator_score);
        $opponent_score.text('joined person score: ' + data.opponent_score);
        for (let i = 0; i < 81; i++) {
            if (data.new_board.charAt(i) !== '.') {
                $cells.eq(i).val(data.new_board.charAt(i));
                $cells.eq(i).attr('disabled', 'true');
            } else {
                $cells.eq(i).val('');
            }
        }
        if (data.winner !== '') {
            if (data.winner === 'creator') {
                $winner_sign.text('game creator won the game!');
            } else if (data.winner === 'joined') {
                $winner_sign.text('joined person won the game!');
            } else {
                $winner_sign.text('the game is draw!');
            }
            $submit.hide();
        } else {
            $submit.hide();
        }
    } else if (!data.turn && socket.id == data.opponent) {
        $creator_score.text('game creator score: ' + data.creator_score);
        $opponent_score.text('joined person score: ' + data.opponent_score);
        for (let i = 0; i < 81; i++) {
            if (data.new_board.charAt(i) !== '.') {
                $cells.eq(i).val(data.new_board.charAt(i));
                $cells.eq(i).attr('disabled', 'true');
            } else {
                $cells.eq(i).val('');
            }
        }
        if (data.winner !== '') {
            if (data.winner === 'creator') {
                $winner_sign.text('game creator won the game!');
            } else if (data.winner === 'joined') {
                $winner_sign.text('joined person won the game!');
            } else {
                $winner_sign.text('the game is draw!');
            }
            $submit.hide();
        } else {
            $submit.show();
        }
    }
});