"use stict";
$(document).ready(function() {

    var board = [null, null, null, null, null, null, null, null, null];
    var playerTurn = true;
    var human, computer;
    var myTurn = false;
    var game = false;

    $('.choice').on('click', function() {
        $(".choose-sides").fadeOut(400);
        $("table").css("pointer-events", "visible");
        game = true;
        if (this.value === "x") {
            human = "X", computer = "O", myTurn = true;
        } else {
            human = "O", computer = "X", myTurn = false, setTimeout(aiTurn, 1300);
        }
        console.log("player is " + human, ": and computer is " + computer);
    });
    // update the board
    function makeMove(state, player, move) {
        if (isSpaceFree(state, move)) {
            if (state[move] === null) {
                state[move] = player;
            }
        }
    }
    // check if there is a free space
    function isSpaceFree(board, move) {
        return board[move] === null ? true : false;
    }
    // check if there is a winner
    function isWinner(st, pl) {
        if ((st[0] == pl && st[1] == pl && st[2] == pl) ||
            (st[0] == pl && st[4] == pl && st[8] == pl) ||
            (st[3] == pl && st[4] == pl && st[5] == pl) ||
            (st[6] == pl && st[7] == pl && st[8] == pl) ||
            (st[0] == pl && st[3] == pl && st[6] == pl) ||
            (st[1] == pl && st[4] == pl && st[7] == pl) ||
            (st[2] == pl && st[5] == pl && st[8] == pl) ||
            (st[2] == pl && st[4] == pl && st[6] == pl)) {
            console.log(st[0]);
            return true;
        }
        return false;
    }
    // create a copy of the board
    function duplicateBoard(board) {
        var boardCopy = [];
        for (var i = 0; i < board.length; i++) {
            boardCopy.push(board[i]);
        }
        return boardCopy;
    }
    // choose a random move from the computer 
    function chooseRandomMove(board, listOfMoves) {
        for (var i = 0; i < listOfMoves.length; i++) {
            if (listOfMoves.length !== 0) {
                var possible = listOfMoves[Math.floor(Math.random() * listOfMoves.length)];
                if (board[possible] === null) {
                    return possible;
                } else {
                    continue;
                }
            }
        }
        return null;
    }
    // get the computer move
    function getComputersMove(board) {
        // check if computer can win in the next move
        for (var j = 0; j < 9; j++) {
            var copy1 = duplicateBoard(board);
            if (isSpaceFree(copy1, j)) {
                makeMove(copy1, computer, j);
                if (isWinner(copy1, computer)) {
                    return j;
                } else {
                    continue;
                }
            }
        }
        //  check if the player could win on the next move, and block them
        for (var i = 0; i < 9; i++) {
            var copy = duplicateBoard(board);
            if (isSpaceFree(copy, i)) {
                makeMove(copy, human, i);
                if (isWinner(copy, human)) {
                    return i;
                } else {
                    continue;
                }
            }
        }
        // try to take the center if it is available
        if (isSpaceFree(board, 4)) {
            return 4;
        }
        // stop the possible player win with corner positions
        if ((board[0] === human && board[0] === board[8]) || (board[2] === human && board[2] === board[6])) {
            var move1 = chooseRandomMove(board, [1, 3, 5, 7]);
            if (move1 !== null && board[move1] === null) {
                return move1;
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
        return true;
    }
    // update the buttons with player values
    function updateButtons(move, player) {
        $("#" + move).text(player);
        $("#" + move).css("opacity", "1");
        if (player === "X") {
            $("#" + move).addClass("btn-info");
        } else {
            $("#" + move).addClass("btn-danger");
        }
    }
    $(".btn").click(function() {
        // $(this).attr("disabled", true);
        if (myTurn && game) {
            var move = this.id;
            if (isSpaceFree(board, move)) {
                myTurn = false;
                makeMove(board, human, move);
                updateButtons(move, human);
                if (isWinner(board, human) && !isBoardFull(board)) {
                    return displayWinner(human);
                } else if (isBoardFull(board)) {
                    displayWinner();
                }
                return setTimeout(aiTurn, 1300);
            }
        }
    });
    // ai function method
    function aiTurn() {
        if (!myTurn && game) {
            var move = getComputersMove(board);
            console.log("this is a board before computer move" + board);
            if (isSpaceFree(board, move)) {
                makeMove(board, computer, move);
                updateButtons(move, computer);
            }
            if (!isBoardFull(board) && isWinner(board, computer)) {
                return displayWinner(computer);
            } else if (isBoardFull(board) && !isWinner(board, computer)) {
                return displayWinner();
            }
            myTurn = true;
        }
    }
    // display winner function and update the game ++++++ (game reset needs to be created)
    function displayWinner(player) {

        var path;
        if (player === human) {
            path = "winner";
        } else if (player === computer) {
            path = "loser";
        } else {
            path = "tie";

        }
        // CREATE A TOGGLE CLASS FOR THE WINNING/LOSING MESSAGE
        for (var i = 0; i < 3; i++) {
            $("." + path).fadeIn(500);
            $("." + path).fadeOut(500);
        }
        setTimeout(resetMoves, 300);
    }
    $(".reset").click(function(e) {
        resetMoves();
    });
    // reset everything
    function resetMoves() {
        if (game) {
            board = [null, null, null, null, null, null, null, null, null];
            playerTurn = true;
            human = "";
            computer = "";
            myTurn = false;
            game = false;
            $(".choose-sides").fadeIn(400);
            $("table").css("pointer-events", "none");
            $(".btn").text("");
            $(".btn").removeClass("btn-info btn-danger");
            game = false;
        }
    }
    // display popup winner message
    function winnerMessage(player) {
        var path;
        if (player === human) {
            path = "winner";
        } else if (player === computer) {
            path = "loser";
        } else {
            path = "tie";
        }
        for (var i = 0; i < 3; i++) {
            $("." + path).css("display", "block");
            $("." + path).css("display", "none");
        }
    }
});