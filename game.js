const sudoku = require('./sudoku');
let io = require('./socket');

class Player {

    constructor(id, score) {
        this.id = id;
        this.score = score;
    }

    setScore(score) {
        if (score) {
            this.score = score;
        }
    }
}

class State {

    constructor(room_id, creator, board, solved_board) {
        this.room_id = room_id;
        this.creator = creator;
        this.board = board;
        this.solved_board = solved_board;
        this.opponent = new Player();
        this.turn = true;
        this.winner = '';
    }

    changeTurn() {
        let secondTurn = this.turn;
        this.turn = !secondTurn;
    }

    setOpponent(newOpponent) {
        if (newOpponent) {
            this.opponent = newOpponent;
        }
    }

    setBoard(newBoard) {
        if (newBoard) {
            this.board = newBoard;
        }
    }

    setCreator_score(score) {
        if (score) {
            this.creator.setScore(score);
        }
    }

    setOpponent_score(score) {
        if (score) {
            this.opponent.setScore(score);
        }
    }

    setWinner(who) {
        if (who) {
            this.winner = who;
        }
    }

}

const states = [];
const game = sudoku.sudoku;

function createGame(socket) {
    const board = game.generate('easy');
    const solvedBoard = game.solve(board);
    creator = new Player(socket.id, 0);
    state = new State(socket.id, creator, board, solvedBoard);
    socket.emit('successful create', {
        creator_score: state.creator.score, 
        board: state.board, 
        room_id: state.room_id});
    states.push(state);
}

function joinGame(socket, rooms, data) {
    if (rooms.get(data.data) !== undefined) {
        let opponent;
        let room_id;
        for (let i = 0; i < states.length; i++) {
            const element = states[i];
            if (element.room_id == data.data) {  
                if (rooms.get(element.room_id).size == 1) {
                    room_id = element.room_id;
                    opponent = new Player(socket.id, 0);
                    element.setOpponent(opponent);
                    socket.join(room_id);
                    io.getIO().sockets.in(room_id).emit('successful join', {
                        creator_score: element.creator.score, 
                        board: element.board, 
                        room_id: element.room_id, 
                        opponent_score: element.opponent.score,
                        creator: element.creator.id,
                        opponent: element.opponent.id,
                        turn: element.turn
                    });
                    break;   
                }
                else {
                    socket.emit('failure join', {reason: 'the room is full!'});
                    break;
                }
            }
        }
    } else {
        socket.emit('failure join', {reason: 'there is no game with this id!'});
    }
}

function submitCell(socket, rooms, data) {
    if (rooms.get(data.id) !== undefined) {
        for (let i = 0; i < states.length; i++) {
            const element = states[i];
            if (element.room_id == data.id) {
                const isCreator = (socket.id === element.creator.id);
                let new_board = data.board;
                const old_board = element.board;
                const answer = element.solved_board;
                for (let j = 0; j < 81; j++) {
                    if (new_board.charAt(j) !== old_board.charAt(j)) {
                        if (new_board.charAt(j) === answer.charAt(j)) {
                            if (isCreator) {
                                element.setCreator_score(parseInt(element.creator.score) + 5);
                            } else {
                                element.setOpponent_score(parseInt(element.opponent.score) + 5);
                            }
                        } else {
                            if (isCreator) {
                                element.setCreator_score(parseInt(element.creator.score) - 5);
                            } else {
                                element.setOpponent_score(parseInt(element.opponent.score) - 5);
                            }
                            let chars = new_board.split('');
                            chars[j] = '.';
                            new_board = chars.join('');
                        }
                    }
                }
                if (new_board === answer) {
                    if (parseInt(element.creator.score) > parseInt(element.opponent.score)) {
                        element.setWinner('creator');
                    } else if (parseInt(element.opponent.score) > parseInt(element.creator.score)){
                        element.setWinner('joined');
                    } else {
                        element.setWinner('both');
                    }
                }
                element.changeTurn();
                element.setBoard(new_board);
                io.getIO().sockets.in(element.room_id).emit('submit answer', {
                    creator_score: element.creator.score, 
                    new_board: element.board, 
                    room_id: element.room_id, 
                    opponent_score: element.opponent.score,
                    creator: element.creator.id,
                    opponent: element.opponent.id,
                    turn: element.turn,
                    winner: element.winner
                })
                break;
            }
        }
    }
}

module.exports = {
    createGame,
    joinGame,
    submitCell,
}
