
drawBoard();

// first ask if the player wants to play as white or black
ask_pov();

let selected_square = null;
let legal_moves = [];
// listen to clicks on the canvas and get the index of the square that was clicked
canvas.addEventListener("click", function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let row = Math.floor(y / squareSize);
    let col = Math.floor(x / squareSize);

    // if a square is already selected
    if (selected_square != null) {
        // check if the clicked square is a legal move
        //check if the clicked square is a new piece of the same color
        if (pov == 1) {
            const square = row * 8 + col;
            const piece = board[square];
            if (piece != 0 && Math.floor(piece/8) === turn && selected_square != square) {
                selected_square = square;
            } else {
                let legal = false;
                for (let i = 0; i < legal_moves.length; i++) {
                    if (legal_moves[i] === square) {
                        legal = true;
                        break;
                    }
                }
                if (!legal) {
                    selected_square = null;
                    drawBoard();
                    return;
                }
                move_piece(selected_square, square);
                selected_square = null;
                drawBoard();
                return;
            }  
        } else {
            const square = (7-row) * 8 + 7 - col;
            const piece = board[square];
            if (piece != 0 && Math.floor(piece/8) === turn && selected_square != square) {
                selected_square = square;
            } else {
                let legal = false;
                for (let i = 0; i < legal_moves.length; i++) {
                    if (legal_moves[i] === square) {
                        legal = true;
                        break;
                    }
                }
                if (!legal) {
                    selected_square = null;
                    drawBoard();
                    return;
                }
                move_piece(selected_square, square);
                selected_square = null;
                drawBoard();
                return;
            }
        }

    } else {
        if (pov == 1) {
            selected_square = row * 8 + col;
        }
        else {
            selected_square = (7-row) * 8 + 7 - col;
        }
    }


    const selected_piece = board[selected_square];
    console.log(selected_piece);

    if (selected_piece == 0 || Math.floor(selected_piece/8) != turn) {
        selected_square = null;
        return;
    }
    console.log(selected_piece);

    legal_moves = get_legal_moves(selected_square);
    console.log(legal_moves);

    // mark the selected square with an orange background
    drawBoard();
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF9900";
    ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    // print with dedicated pawn squishing
    draw_piece(selected_piece, row, col, (selected_piece === 2 || selected_piece === 10) ? 0.6: 0.9, (selected_piece === 2 || selected_piece === 10) ? 0.8: 0.9,);
    // print a yellow circle on each legal move
    draw_legal_moves(legal_moves);
});

function move_piece(from, to) {
    // start simple, just move the piece
    // update the piece's position
    piece_positions[board[from]][piece_positions[board[from]].indexOf(from)] = to;
    to_piece = board[to];
    if (to_piece != 0) {
        piece_positions[to_piece].splice(piece_positions[to_piece].indexOf(to), 1);
    }

    board[to] = board[from];
    board[from] = 0;
    // update the board
    // update the turn
    turn = (turn + 1) % 2;

    drawBoard();
}
    

function restart() {

    board = initialize_board();

    drawBoard();

    white_left_castle = true;
    white_right_castle = true;
    black_left_castle = true;
    black_right_castle = true;

    turn = 1;
    selected_square = null;
    ask_pov();
}

function ask_pov() {
    let choice_element = document.createElement("div");
    choice_element.style.position = "absolute";
    choice_element.style.display = "flex";
    choice_element.style.flexDirection = "column";
    choice_element.style.justifyContent = "center";
    choice_element.style.alignItems = "center";
    choice_element.style.width = "100%";
    choice_element.style.height = "100%";
    choice_element.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    choice_element.style.zIndex = "1";

    let choice_text = document.createElement("div");
    choice_text.style.color = "white";
    choice_text.style.fontSize = "40px";
    choice_text.innerHTML = "Choose your color";
    choice_element.appendChild(choice_text);

    let div = document.createElement("div");
    div.style.width = "400px";
    div.style.height = "200px";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";


    let white = document.createElement("div");
    white.style.width = "100px";
    white.style.height = "100px";
    white.style.margin = "20px";
    white.style.backgroundColor = "white";
    white.style.borderRadius = "50%";
    white.style.zIndex = "2";
    white.onclick = function() {
        document.body.removeChild(choice_element);
        pov = 1;
        // board = initialize_board();
        // bot = new Chess_bot(0);  // the bot is the opposite color of the player
        drawBoard();
        console.log("we are white");
    };

    let black = document.createElement("div");
    black.style.width = "100px";
    black.style.height = "100px";
    black.style.margin = "20px";
    black.style.backgroundColor = "black";
    black.style.borderRadius = "50%";
    black.style.zIndex = "2";
    black.onclick = function() {
        document.body.removeChild(choice_element);
        pov = 0;
        board = initialize_board();
        // bot = new Chess_bot(1);  // the bot is the opposite color of the player
        // bot.move(board); // the bot makes the first move
        drawBoard();
    };

    div.appendChild(white);
    div.appendChild(black);
    choice_element.appendChild(div);
    document.body.appendChild(choice_element);
}