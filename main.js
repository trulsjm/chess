
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
    const moved_piece = board[from];
    piece_positions[moved_piece][piece_positions[moved_piece].indexOf(from)] = to;
    const to_piece = board[to];
    if (to_piece != 0) {
        piece_positions[to_piece].splice(piece_positions[to_piece].indexOf(to), 1);
    }

    // check if the move is en passant
    if (moved_piece === 10 && to + 8 === white_en_passant) {
        console.log("en passant");
        board[white_en_passant] = 0;
        piece_positions[2].splice(piece_positions[2].indexOf(white_en_passant), 1);
    } else if (moved_piece === 2 && to - 8 === black_en_passant) { 
        console.log("en passant");
        board[black_en_passant] = 0;
        piece_positions[10].splice(piece_positions[10].indexOf(black_en_passant), 1);
    }

    // check if the move gives en passant
    console.log(to, from);
    if (moved_piece === 10 && to + 16 === from) {
        console.log("en passant chance");
        black_en_passant = to;
    } else if (moved_piece === 2 && to - 16 === from) {
        console.log("en passant chance");
        white_en_passant = to;
    } else {
        white_en_passant = null;
        black_en_passant = null;
    }

    // check if the move is a castle, and also remove castling if king moved
    switch (moved_piece) {
        case 9:
            white_left_castle = false;
            white_right_castle = false;
          if (from === 60 && to === 62) {
            console.log("white left castle");
            board[61] = 13;
            board[63] = 0;
            piece_positions[13].push(61);
            piece_positions[13].splice(piece_positions[13].indexOf(63), 1);

          } else if (from === 60 && to === 58) {
            board[59] = 13;
            board[56] = 0;
            piece_positions[13].push(59);
            piece_positions[13].splice(piece_positions[13].indexOf(56), 1);
          }
          break;
        case 1:
            black_left_castle = false;
            black_right_castle = false;
          if (from === 4 && to === 6) {
            board[5] = 5;
            board[7] = 0;
            piece_positions[5].push(5);
            piece_positions[5].splice(piece_positions[5].indexOf(7), 1);

          } else if (from === 4 && to === 2) {
            board[3] = 5;
            board[0] = 0;
            piece_positions[5].push(3);
            piece_positions[5].splice(piece_positions[5].indexOf(0), 1);
          }
          break;
        default:
          break;
      }

      // remove castling rights if the rook moves
    switch (moved_piece) {
        case 5:
            switch (from) {
                case 0:
                    black_left_castle = false;
                    break;
                case 7:
                    black_right_castle = false;
                    break;
                default:
                    break;
            }  
         case 13:
            switch (from) {
                case 56:
                    white_left_castle = false;
                    break;
                case 63:
                    white_right_castle = false;
                    break;
                default:
                    break;
            }
            default:
            break;
        }




    board[to] = moved_piece;
    board[from] = 0;
    // update the board
    // update the turn
    turn = (turn + 1) % 2;

    drawBoard();
}

function is_square_attacked(square, color) {
    console.log("checking if square is attacked", square, "by color", color);
    // loop through all pieces and create an impostor for this square
    // and check if it can hit any pieces of the opposing color (color) 
    const real_piece = board[square];
    let base = (color === 1) ? 0 : 8; // 0 if white is attacker, 8 if black is attacker
    for (let i = 1; i < 7; i++) { // TODO: can be optimized by checking queen at the same time as bishop and rook
        const impostor_piece = base + i;
        board[square] = impostor_piece;
        const legal_moves = get_legal_moves(square, true);
        if (impostor_piece === 4) {
            console.log("legal moves for bishop", legal_moves);
            console.log(board[legal_moves[4]]);
            console.log();
        }
        for (let j = 0; j < legal_moves.length; j++) {
            if (board[legal_moves[j]] === impostor_piece + 16 * color - 8) {
                board[square] = real_piece;
                console.log("yes, by", impostor_piece, i);
                return true;
            }
            
        }
    }
    board[square] = real_piece;
    return false;
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