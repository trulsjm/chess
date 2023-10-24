function get_legal_moves(piece_index, search = false){
    // check if the king is in check after each move
    const moves = get_moves(piece_index, search);
    const piece = board[piece_index];
    let legal_moves = [];
    opposite_color = (turn + 1) % 2;
    // if the piece moving is the king; we do it differently
    if (piece == 1 || piece == 9){
        for (let i = moves.length - 1; i >= 0; i--){
            // check if the square is in check
            const move = moves[i];
            if (!is_square_attacked(move, opposite_color)){
                legal_moves.push(move);
            }
        }
        return legal_moves;
    }

    const king_square = piece_positions[turn * 8 + 1][0];

    if (piece == 2){
        console.log(king_square);
    }

    for (let i = 0; i < moves.length; i++){
        // make the move on the board
        const move = moves[i];
        const to_square = board[move];
        board[move] = piece;
        board[piece_index] = 0;
        if (!is_square_attacked(king_square, opposite_color)){
            legal_moves.push(move);
        }
        //unmake the move
        board[piece_index] = board[move];
        board[move] = to_square;
    }
    console.log(legal_moves);
    return legal_moves;
}

function get_moves(piece_index, search = false){

    piece_type = board[piece_index];
    if (piece_type == 0){
        return [];
    }
    // new logic for move generation
    let moves = [];
    let directions = [];
    switch (piece_type) {
        case 1: // Black king
        moves = [piece_index - 8, piece_index + 8, piece_index - 1, piece_index + 1, piece_index - 7, piece_index - 9, piece_index + 7, piece_index + 9];
        for (let i = moves.length - 1; i >= 0; i--){
            let move = moves[i];
            // up moves
            if (move < 0 || move < 0){
                moves.splice(i, 1);
                continue;
            }
            // down moves
            if (move > 63 || move > 63){
                moves.splice(i, 1);
                continue;
            }
            // see if there is a piece of the same color in the way
            if (board[move] > 0 && board[move] < 7){
                moves.splice(i, 1);
                continue;
            }
            // right moves
            if (move % 8 == 0 && (i == 3 || i == 4 || i == 7)){
                moves.splice(i, 1);
                continue;
            }
            // left moves
            if ((move + 1) % 8 == 0 && (i == 2 || i == 5 || i == 6)){
                moves.splice(i, 1);
                continue;
            }
        }
        // castling
        if (!search){
            if (black_left_castle){
                if (board[3] === 0 && board[2] === 0 && board[1] === 0 && !is_square_attacked(3, 1) && !is_square_attacked(4, 1) && !is_square_attacked(2, 1)){
                    moves.push(2);
                }
            }
            if (black_right_castle){
                if (board[5] === 0 && board[6] === 0 && !is_square_attacked(5, 1) && !is_square_attacked(4, 1) && !is_square_attacked(6, 1)){
                    moves.push(6);
                }
            }
        } 
        return moves;
        case 2: // Black pawn
            // see if there is a piece in the way
            moves = [];
            if (board[piece_index + 8] === 0){
                moves.push(piece_index + 8);
                if (board[piece_index + 16] === 0 && piece_index < 16){
                    moves.push(piece_index + 16);
                }
            }
            // left capture
            if (board[piece_index + 7] > 0 && board[piece_index + 7] > 7 && (piece_index + 8) % 8 != 0){
                moves.push(piece_index + 7);
            }
            // right capture
            if (board[piece_index + 9] > 0 && board[piece_index + 9] > 7 && (piece_index + 9) % 8 != 0){
                moves.push(piece_index + 9);
            }
            // TODO: en passant, maybe with a list or dictionary which keeps track for spesific squares: [false, false, false, false, true, false, true, false] for both the ranks that can be en passanted
            // if an index is true, that means that column can be captured
            if (piece_index > 31 && piece_index < 40){
                // left en passant
                if (black_en_passant === piece_index - 1 && (piece_index) % 8 != 0){
                    moves.push(piece_index + 7);
                }
                // right en passant
                if (black_en_passant === piece_index + 1 && (piece_index + 1) % 8 != 0){
                    moves.push(piece_index + 9);
                }
            }
            // TODO: promotion
            return moves;
        case 3: // Black knight
            moves = [piece_index - 17, piece_index - 15, piece_index - 10, piece_index - 6, piece_index + 6, piece_index + 10, piece_index + 15, piece_index + 17];
            for (let i = moves.length - 1; i >= 0; i--){
                // up moves
                if (moves[i] < 0 || moves[i] < 0){
                    moves.splice(i, 1);
                    continue;
                }
                // down moves
                if (moves[i] > 63 || moves[i] > 63){
                    moves.splice(i, 1);
                    continue;
                }
                // see if there is a piece of the same color in the way
                if (board[moves[i]] > 0 && board[moves[i]] < 7){
                    moves.splice(i, 1);
                    continue;
                }
                // right moves
                if (moves[i] % 8 == 0 && (i == 1 || i == 3 || i == 5 || i == 7)){
                    moves.splice(i, 1);
                    continue;
                }
                // left moves
                if ((moves[i] + 1) % 8 == 0 && (i == 0 || i == 2 || i == 4 || i ==6)){
                    moves.splice(i, 1);
                    continue;
                }
                // far right moves
                if (moves[i] % 8 == 1 && (i == 3 || i == 6)){
                    moves.splice(i, 1);
                    continue;
                }
                // far left moves
                if ((moves[i] + 1) % 8 == 1 && (i == 2 || i == 4)){
                    moves.splice(i, 1);
                    continue;
                }
            }
            return moves;
        case 4: // Black bishop
            directions = [-9, -7, 7, 9];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if ((i === 1 || i === 3) && current_index % 8 === 0) {
                        break;
                    }
                    if ((i === 0 || i === 2) && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] > 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;
        case 5: // Black rook
            directions = [-8, -1, 1, 8];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if (i === 2 && current_index % 8 === 0) {
                        break;
                    }
                    if (i === 1 && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] > 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;
        case 6: // Black queen
            directions = [-8, -1, 1, 8, -9, -7, 7, 9];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if ((i === 2 || i === 5 || i === 7) && current_index % 8 === 0) {
                        break;
                    }
                    if ((i === 1 || i === 4 || i === 6) && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] > 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;

        case 9: // White king

            moves = [piece_index - 8, piece_index + 8, piece_index - 1, piece_index + 1, piece_index - 7, piece_index - 9, piece_index + 7, piece_index + 9];
            for (let i = moves.length - 1; i >= 0; i--){
                // up moves
                if (moves[i] < 0 || moves[i] < 0){
                    moves.splice(i, 1);
                    continue;
                }
                // down moves
                if (moves[i] > 63 || moves[i] > 63){
                    moves.splice(i, 1);
                    continue;
                }
                // see if there is a piece of the same color in the way
                if (board[moves[i]] > 0 && board[moves[i]] > 7){
                    moves.splice(i, 1);
                    continue;
                }
                // right moves
                if (moves[i] % 8 == 0 && (i == 3 || i == 4 || i == 7)){
                    moves.splice(i, 1);
                    continue;
                }
                // left moves
                if ((moves[i] + 1) % 8 == 0 && (i == 2 || i == 5 || i == 6)){
                    moves.splice(i, 1);
                    continue;
                }
            }
            // castling
            if (!search){
                if (white_left_castle && !is_square_attacked(60, 0) && !is_square_attacked(59, 0) && !is_square_attacked(58, 0)){
                    if (board[59] === 0 && board[58] === 0 && board[57] === 0){
                        moves.push(58);
                    }
                }
                if (white_right_castle && !is_square_attacked(60, 0) && !is_square_attacked(61, 0) && !is_square_attacked(62, 0)){
                    if (board[61] === 0 && board[62] === 0){
                        moves.push(62);
                    }
                }
            }
            return moves;
        case 10: // White pawn
            // see if there is a piece in the way
            moves = [];
            if (board[piece_index - 8] === 0){
                moves.push(piece_index - 8);
                if (board[piece_index - 16] === 0 && piece_index > 47){
                    moves.push(piece_index - 16);
                }
            }
            // right capture
            if (board[piece_index - 7] > 0 && board[piece_index - 7] < 7 && (piece_index - 7) % 8 != 0){
                moves.push(piece_index - 7);
            }
            // left capture
            if (board[piece_index - 9] > 0 && board[piece_index - 9] < 7 && (piece_index - 8) % 8 != 0){
                moves.push(piece_index - 9);
            }
            // TODO: en passant, maybe with a list or dictionary which keeps track for spesific squares: [false, false, false, false, true, false, true, false] for both the ranks that can be en passanted
            // if an index is true, that means that column can be captured
            if (piece_index > 23 && piece_index < 32){
                // left en passant
                if (white_en_passant === piece_index - 1 && (piece_index) % 8 != 0){
                    moves.push(piece_index - 9);
                }
                // right en passant
                if (white_en_passant === piece_index + 1 && (piece_index + 1) % 8 != 0){
                    moves.push(piece_index - 7);
                }

            }
            // TODO: promotion
            return moves;
        case 11: // White knight
        moves = [piece_index - 17, piece_index - 15, piece_index - 10, piece_index - 6, piece_index + 6, piece_index + 10, piece_index + 15, piece_index + 17];
            for (let i = moves.length - 1; i >= 0; i--){
                // up moves
                if (moves[i] < 0 || moves[i] < 0){
                    moves.splice(i, 1);
                    continue;
                }
                // down moves
                if (moves[i] > 63 || moves[i] > 63){
                    moves.splice(i, 1);
                    continue;
                }
                // see if there is a piece of the same color in the way
                if (board[moves[i]] > 0 && board[moves[i]] > 7){
                    moves.splice(i, 1);
                    continue;
                }
                // right moves
                if (moves[i] % 8 == 0 && (i == 1 || i == 3 || i == 5 || i == 7)){
                    moves.splice(i, 1);
                    continue;
                }
                // left moves
                if ((moves[i] + 1) % 8 == 0 && (i == 0 || i == 2 || i == 4 || i ==6)){
                    moves.splice(i, 1);
                    continue;
                }
                // far right moves
                if (moves[i] % 8 == 1 && (i == 3 || i == 6)){
                    moves.splice(i, 1);
                    continue;
                }
                // far left moves
                if ((moves[i] + 1) % 8 == 1 && (i == 2 || i == 4)){
                    moves.splice(i, 1);
                    continue;
                }
            }
            return moves;
        case 12: // White bishop
            directions = [-9, -7, 7, 9];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if ((i === 1 || i === 3) && current_index % 8 === 0) {
                        break;
                    }
                    if ((i === 0 || i === 2) && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] < 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;
        case 13: // White rook
            directions = [-8, -1, 1, 8];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if (i === 2 && current_index % 8 === 0) {
                        break;
                    }
                    if (i === 1 && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] < 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;
        case 14: // White queen
            directions = [-8, -1, 1, 8, -9, -7, 7, 9];
            for (let i = 0; i < directions.length; i++){
                let current_index = piece_index;
                while (true){
                    current_index += directions[i];
                    if (current_index < 0 || current_index > 63){
                        break;
                    }
                    if ((i === 2 || i === 5 || i === 7) && current_index % 8 === 0) {
                        break;
                    }
                    if ((i === 1 || i === 4 || i === 6) && (current_index + 1) % 8 === 0) {
                        break;
                    }
                    if (board[current_index] != 0){
                        if (board[current_index] < 7){
                            moves.push(current_index);
                        }
                        break;
                    }
                    moves.push(current_index);
                }
            }
            return moves;


        default:
            break;
    }


}
