function get_legal_moves(piece_index){

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
            console.log(moves);
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
            console.log(moves);
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
