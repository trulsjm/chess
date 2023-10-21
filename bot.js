let count = 0;

class Chess_bot{
    constructor(pov){
        this.favorite_move = null;
        this.favorite_move_score = 0;
        this.pov = pov;

    }
    move(board){
        count = 0;

        board_copy = board_deep_copy(board);

        // save the castling rights 
        const white_left_castle_copy = white_left_castle;
        const white_right_castle_copy = white_right_castle;
        const black_left_castle_copy = black_left_castle;
        const black_right_castle_copy = black_right_castle;



        // MINIMAX call
        const best_score_and_moveIndex = minimax(board_copy, 2, 0, this.pov, -Infinity, Infinity); // [score, moveIndex]

        // reset the castling rights
        white_left_castle = white_left_castle_copy;
        white_right_castle = white_right_castle_copy;
        black_left_castle = black_left_castle_copy;
        black_right_castle = black_right_castle_copy;

        const legal_moves = get_all_legal_moves(board, this.pov);
        const best_move = legal_moves[best_score_and_moveIndex[1]]; // [piece, row, col]
        // make the move
        turn = this.pov; // set the turn so the "actual move" sets turn to the other POV
        best_move[0].move(best_move[1], best_move[2], board, false);

        console.log(count)

    }
}


function minimax(board, depth, decrease_depth, pov, alpha, beta){ // decrease depth on every other call to minimax so that both sides make a move per depth
    count++;
    if (count > 10000){
        console.log("count exceeded");
        return [evaluate_board(board), 0];
    }
    // Base case: if the depth is 0 or the game is over, return the board evaluation.
    if (depth === 0) {
        return [evaluate_board(board), 0];
    }
    if (game_over(board_copy)){
        return [evaluate_board(board), 0];
    }
    // If it's white's turn, find the move with the highest score
    if (pov == 1) {
        turn = !pov;       // TODO this is probably temporary, might need to change turn thing on pawn promotion
        let maxEval = -Infinity;
        let moveIndex = 0;
        const legal_moves = get_all_legal_moves(board, pov);
        for (let i = 0; i < legal_moves.length; i++) {
            let board_copy = board_deep_copy(board);
            // Make the move and recursively evaluate the board.
            const move = legal_moves[i];
            const piece = move[0];
            const piece_copy = new Piece(piece.row, piece.col, piece.color, piece.type);
            if (piece.left_en_passant == true){
                piece_copy.left_en_passant = true;
            }
            if (piece.right_en_passant == true){
                piece_copy.right_en_passant = true;
            }

            const row = move[1];
            const col = move[2];
            piece_copy.move(row, col, board_copy, true);

            const evaluation_and_index = minimax(board_copy, depth - decrease_depth, (decrease_depth+1)%2, 0, alpha, beta);
            if (evaluation_and_index[0] > maxEval) {
                    maxEval = evaluation_and_index[0];
                    moveIndex = i;
            }
            alpha = Math.max(alpha, maxEval);
            if (beta <= alpha) {
                break;
            }
        }
        return [maxEval, moveIndex];
        
    } else { // If it's black's turn, find the move with the lowest score
        turn = pov;
        let minEval = Infinity;
        let moveIndex = 0;
        let legal_moves = get_all_legal_moves(board, pov);
        for (let i = 0; i < legal_moves.length; i++) {
            const board_copy = board_deep_copy(board);
            // Make the move and recursively evaluate the board.
            const move = legal_moves[i];
            const piece = move[0];
            const piece_copy = new Piece(piece.row, piece.col, piece.color, piece.type);
            if (piece.left_en_passant == true){
                piece_copy.left_en_passant = true;
            }
            if (piece.right_en_passant == true){
                piece_copy.right_en_passant = true;
            }

            const row = move[1];
            const col = move[2];
            piece_copy.move(row, col, board_copy, true);

            const evaluation_and_index = minimax(board_copy, depth - (decrease_depth), (decrease_depth+1)%2, 1, alpha, beta); // TODO this is where the depth is changed so that both sides make a move per depth
            if (evaluation_and_index[0] < minEval) {
                minEval = evaluation_and_index[0];
                moveIndex = i;
            }
            beta = Math.min(beta, minEval);
            if (beta <= alpha) {
                break;
            }
        }
        return [minEval, moveIndex];
    }

}

function evaluate_board(board){
    let score = 0;
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (board[i][j] != null){
                if (board[i][j].color == 1){
                    score += board[i][j].value; 
                } else {
                    score -= board[i][j].value;
                }
            }
        }
    }
    return score;
}

function game_over(board){
    // TODO 
    return false;
}



function get_all_legal_moves(board, color){
    
    let legal_moves = []; // [piece, row, col]
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (board[i][j] != null && board[i][j].color == color){
                let moves = board[i][j].get_legal_moves(board, true);
                
                for (let k = 0; k < moves.length; k++){
                    legal_moves.push([board[i][j], moves[k][0], moves[k][1]]);
                }
            }
        }
    }
    return legal_moves;
}
