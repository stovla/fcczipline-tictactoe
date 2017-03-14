$(document).ready(function() {

    var board = [null, null, null, null, null, null, null, null, null];
    var playerTurn = true;
    var human, computer;
    var myTurn = true;
    var game = true;

    $('.choice').on('click', function() {
        this.value == "x" ? (human = "X", computer = "O") : (human = "O", computer = "X");
        console.log("player is " + human, ": and computer is " + computer);
    });
    // update the board
    function makeMove(board, player, move) {
        if (isSpaceFree(board, move)) {
            console.log("field is free " + isSpaceFree(board, move));
            board[move] = player;
        }
    }
    // check if there is a free space
    function isSpaceFree(board, move) {
        return board[move] === null ? true : false;
    }
    // confirm function for free space works
    console.log(isSpaceFree(board, move));
    // check if there is a winner
    function isWinner(st, pl) {
        return (st[0] == pl && st[1] == pl && st[2]) ||
            (st[3] == pl && st[4] == pl && st[5] == pl) ||
            (st[6] == pl && st[7] == pl && st[8] == pl) ||
            (st[0] == pl && st[3] == pl && st[6] == pl) ||
            (st[1] == pl && st[4] == pl && st[7] == pl) ||
            (st[2] == pl && st[5] == pl && st[8] == pl) ||
            (st[0] == pl && st[4] == pl && st[8] == pl) ||
            (st[6] == pl && st[4] == pl && st[2] == pl) ? true : false;
    }
    // create a copy of the board
    function duplicateBoard(board) {
        let boardCopy = [];
        for (var i = 0; i < board.length; i++) {
            boardCopy.push(board[i]);
        }
        return boardCopy;
    }
    // choose a random move from the computer 
    function chooseRandomMove(board, listOfMoves) {
        for (var i = 0; i < listOfMoves.length; i++) {
            if (listOfMoves.length != 0) {
                let possible = listOfMoves[Math.floor(Math.random() * listOfMoves.length)];
                return possible;
            } else {
                return null;
            }
        }
    }
    // get the computer move
    function getComputersMove(board) {
        // first try to take the center if it is available
        if (isSpaceFree(board, 4)) {
            return 4;
        }
        //  check if the player could win on the next move, and block them
        for (var i = 0; i < 9; i++) {
            let copy = duplicateBoard(board);
            if (isSpaceFree(copy, i)) {
                makeMove(copy, human, i);
                if (isWinner(copy, human)) {
                    return i;
                }
            }
        }
        // check if computer can win in the next move
        for (var i = 0; i < 9; i++) {
            let copy = duplicateBoard(board);
            if (isSpaceFree(copy, i)) {
                makeMove(copy, computer, i);
                if (isWinner(copy, computer)) {
                    return i;
                }
            }
        }
        // try to take one of the corners if they are free
        var move = chooseRandomMove(board, [0, 2, 6, 8]);
        if (move !== null && board[move] === null) {
            return move;
        }
        return chooseRandomMove(board, [1, 3, 5, 7]);
    }
    // check if the board is full
    function isBoardFull(copy) {
        for (var i = 0; i < copy.length; i++) {
            if (copy[i] === null) {
                return false;
            }
        }
        return displayWinner();
    }

    // log if the board is full
    console.log(isBoardFull(board));
    // update winner 
    function updateScreen(board, player) {
        if (isWinner(board, player)) {
            alert("The winner is " + player);
        }
    }
    // update the buttons with player values
    function updateButtons(move, player) {
        $("#" + move).text(player);
    }
    $(".btn").click(function() {
        if (playerTurn) {
            var move = this.id;
            if (isSpaceFree(board, move)) {
                playerTurn = false;
                makeMove(board, human, move);
                updateButtons(move, human);
                isBoardFull(board);
                if (isWinner(board, human)) {
                    displayWinner(human);
                }
                return setTimeout(aiTurn, 1000);
            }
        }
    });
    // ai function method
    function aiTurn() {
        if (!playerTurn) {
            var move = getComputersMove(board);
            console.log("this is a board before computer move" + board);
            if (isSpaceFree(board, move)) {
                makeMove(board, computer, move);
                updateButtons(move, computer);
            }
            isBoardFull(board);
            if (isWinner(board, computer)) {
                displayWinner(computer);
            }
            playerTurn = true;
        }
    }
    // display winner function and update the game ++++++ (game reset needs to be created)
    function displayWinner(player) {
        game = false;
        setTimeout(function() {
            return player === human ? alert("You Win") :
                player === computer ? alert("Computer Wins") :
                alert("It's a Tie");
        }, 1000);
    }
});