let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let squareSize = canvasWidth / 8;

function drawBoard() {
    // Draw a chessboard on the canvas element
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#4c3228";

    for (let i = 7; i >= 0; i--) {
        for (let j = 1- (i % 2); j < 8; j += 2) {
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
        }
    }
    
    // Draw the pieces on the canvas element
    // print everything from the piece_positions dictionary
    for (let i = 1; i < 15; i++) {
        const pieces = piece_positions[i]
        for (let j = 0; j < pieces.length; j++) {
            let squish = 0.9;
            let smunch = 0.9;
            if (i === 2 || i === 10) {
            squish = 0.6;
            smunch = 0.8;
            }
            const square = pieces[j];
            const row = Math.floor(square/8);
            const col = square%8
            if (pov === 1) {
                draw_piece(i, row, col, squish, smunch)
            } else {
                draw_piece(i, 7-row, 7-col, squish, smunch)
            }
        }
        if (i === 6) {
            i = 8
        }
    }
}

function draw_piece(piece, row, col, squish, smunch) {
    const image = get_piece_image(piece);
    pawn_offset = (piece == 2 || piece == 10) ? 5 : 0;
    ctx.drawImage(image, col * squareSize + (1 - squish)/2 * squareSize, row * squareSize+ (1 - smunch)/2 * squareSize + pawn_offset, squareSize * squish, squareSize * smunch);
}

function draw_legal_moves(legal_moves) {
    ctx.fillStyle = "#FF9900";
    if (pov == 1) {
        for (let i = 0; i < legal_moves.length; i++) {
            ctx.beginPath();
            ctx.arc(legal_moves[i]%8 * squareSize + squareSize / 2, Math.floor(legal_moves[i]/8) * squareSize + squareSize / 2, squareSize / 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else {
        for (let i = 0; i < legal_moves.length; i++) {
            ctx.beginPath();
            ctx.arc((7 - legal_moves[i]%8) * squareSize + squareSize / 2, (7 - Math.floor(legal_moves[i]/8)) * squareSize + squareSize / 2, squareSize / 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function get_piece_image(piece){
    switch (piece) {
        case 1:
            return black_king_image;
        case 2:
            return black_pawn_image;
        case 3:
            return black_knight_image;
        case 4:
            return black_bishop_image;
        case 5:
            return black_rook_image;
        case 6:
            return black_queen_image;
        case 9:
            return white_king_image;
        case 10:
            return white_pawn_image;
        case 11:
            return white_knight_image;
        case 12:
            return white_bishop_image;
        case 13:
            return white_rook_image;
        case 14:
            return white_queen_image;

    }
}



function print_board() {
    // Print the board to the console
    let board_string = "";
    for (let i = 0; i < 64; i++) {
        board_string += board[i] + " ";
        if (board[i] < 10) {
            board_string += " ";
        }
        if (i % 8 == 7) {
            board_string += "\n";
        }
    }
    console.log(board_string);
}