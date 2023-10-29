// how deep can it go 
const search_depth = 4;

function bot_move() {
    bot_pov = (pov + 1) % 2;

    const legal_moves = order_moves(get_all_legal_moves(bot_pov))
    const score_and_moveIndex = minimax(true, search_depth, -Infinity, Infinity);
    const moveIndex = score_and_moveIndex[1];
    const move = legal_moves[moveIndex];

    if (move == undefined) {
        console.log("bot thinks it is going to lose");
        // make a random move
        const move = legal_moves[Math.floor(Math.random() * legal_moves.length)];
        move_piece(move[0], move[1]);
        console.log("bot moved", move[0], move[1]);
        console.log("score", score_and_moveIndex[0]);
        return;
    }

    move_piece(move[0], move[1]);
    console.log("bot moved", move[0], move[1]);
    console.log("score", score_and_moveIndex[0]);

}

function minimax(maximizing_bot, depth, alpha, beta) { // Depth is the number of moves ahead the bot will look counting white and black individually
    if (depth == 0) {
        return [evaluate_board(), null];
    }

    if (maximizing_bot) {
        let maxEval = -20000;
        let moveIndex = null;
        const legal_moves = order_moves(get_all_legal_moves(bot_pov));

        // return some value if stalemate, -infinite value if checkmate
        if (legal_moves.length === 0) {
            if (is_square_attacked(piece_positions[bot_pov * 8 + 1][0], pov)) {
                return [-20000 - depth * 100, null];
            }
        }

        for (let i = 0; i < legal_moves.length; i++) {
            const move = legal_moves[i];
            const moved_piece = board[move[0]];
            const from = move[0];
            const to = move[1];
            let captured_piece = board[to];

            // save the castling rights and en passant before the move
            const white_left_castle_copy = white_left_castle;
            const white_right_castle_copy = white_right_castle;
            const black_left_castle_copy = black_left_castle;
            const black_right_castle_copy = black_right_castle;
            const white_en_passant_copy = white_en_passant;
            const black_en_passant_copy = black_en_passant;

            // checking for en passant
            let white_made_en_passant = false;
            let black_made_en_passant = false;
            if (moved_piece === 10) {
                if ((to - from) % 8 != 0 && captured_piece === 0) {
                    captured_piece = board[to + 8];
                    white_made_en_passant = true;
                }
            } else if (moved_piece === 2) {
                if ((to - from) % 8 != 0 && captured_piece === 0) {
                    captured_piece = board[to - 8];
                    black_made_en_passant = true;
                }
            }
            
            // go deeper 
            move_piece(from, to, true);
            const evaluation_and_index = minimax(false, depth - 1, alpha, beta);
            turn = (turn + 1) % 2;  // switching the turn back after the move_piece function switches it

            // undo the castling rights
            white_left_castle = white_left_castle_copy;
            white_right_castle = white_right_castle_copy;
            black_left_castle = black_left_castle_copy;
            black_right_castle = black_right_castle_copy;
            white_en_passant = white_en_passant_copy;
            black_en_passant = black_en_passant_copy;

            // undo rook move after castling
            if (moved_piece === 1) {
                if (from === 4 && to === 2) {
                    board[0] = 5;
                    board[3] = 0;
                    piece_positions[5][piece_positions[5].indexOf(3)] = 0;
                }
                if (from === 4 && to === 6) {
                    board[7] = 5;
                    board[5] = 0;
                    piece_positions[5][piece_positions[5].indexOf(5)] = 7;
                }
                
            } else if (moved_piece === 9) {
                if (from === 60 && to === 58) {
                    board[56] = 13;
                    board[59] = 0;
                    piece_positions[13][piece_positions[13].indexOf(59)] = 56;
                }
                if (from === 60 && to === 62) {
                    board[63] = 13;
                    board[61] = 0;
                    piece_positions[13][piece_positions[13].indexOf(61)] = 63;
                }
            }

            // undo the move
            piece_positions[moved_piece][piece_positions[moved_piece].indexOf(to)] = from;

            // undo en passant
            if (white_made_en_passant) {
                piece_positions[captured_piece].push(to + 8); 
                board[to + 8] = captured_piece;
                captured_piece = 0;
                board[to] = 0;
                board[from] = moved_piece;
            
            } else if (black_made_en_passant) {
                piece_positions[captured_piece].push(to - 8);
                board[to - 8] = captured_piece;
                captured_piece = 0;
                board[to] = 0;
                board[from] = moved_piece;
            
            } else if (captured_piece != 0) {
                piece_positions[captured_piece].push(to);
                board[from] = moved_piece;
                board[to] = captured_piece;
            
            }   else {
                board[from] = moved_piece;
                board[to] = 0;
            }


            // if pawn promotion, remove the queen from piece_positions
            if ((moved_piece === 2 || moved_piece === 10) && (to < 8 || to > 55)) {
                piece_positions[6 + 8 * (turn)].splice(piece_positions[6 + 8 * (turn)].indexOf(to), 1);
                piece_positions[2 + 8 * (turn)].push(from);
            }





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
    }
    // minimizing bot
    else {
        let minEval = 20000;
        let moveIndex = null;
        const legal_moves = order_moves(get_all_legal_moves((bot_pov + 1) % 2))

        // return some value if stalemate, infinite value if checkmate
        if (legal_moves.length === 0) {
            // the larger the depth is (the shallower the search) the better the score for mate
            if (is_square_attacked(piece_positions[pov * 8 + 1][0], bot_pov)) {
                return [20000 + depth * 1000, null];
            }
            return [-40, null];
        }

        for (let i = 0; i < legal_moves.length; i++) {
            const move = legal_moves[i];
            const moved_piece = board[move[0]];
            const from = move[0];
            const to = move[1];
            let captured_piece = board[to];

            // save the castling rights and en passant before the move
            const white_left_castle_copy = white_left_castle;
            const white_right_castle_copy = white_right_castle;
            const black_left_castle_copy = black_left_castle;
            const black_right_castle_copy = black_right_castle;
            const white_en_passant_copy = white_en_passant;
            const black_en_passant_copy = black_en_passant;

            // checking for en passant
            let white_made_en_passant = false;
            let black_made_en_passant = false;

            if (moved_piece === 10) {
                if ((to - from) % 8 != 0 && captured_piece === 0) {
                    captured_piece = board[to + 8];
                    white_made_en_passant = true;
                }
            } else if (moved_piece === 2) {
                if ((to - from) % 8 != 0 && captured_piece === 0) {
                    captured_piece = board[to - 8];
                    black_made_en_passant = true;
                }
            }

            move_piece(from, to, true);
            const evaluation_and_index = minimax(true, depth - 1, alpha, beta);
            turn = (turn + 1) % 2;  // switching the turn back after the move_piece function switches it


            // Start undoing

            // undo castling rights
            white_left_castle = white_left_castle_copy;
            white_right_castle = white_right_castle_copy;
            black_left_castle = black_left_castle_copy;
            black_right_castle = black_right_castle_copy;
            // undo en passant flags
            
            white_en_passant = white_en_passant_copy;
            black_en_passant = black_en_passant_copy;

            // undo the rook move after castling
            if (moved_piece === 1) {
                if (from === 4 && to === 2) {
                    board[0] = 5;
                    board[3] = 0;
                    piece_positions[5][piece_positions[5].indexOf(3)] = 0;
                }
                if (from === 4 && to === 6) {
                    board[7] = 5;
                    board[5] = 0;
                    piece_positions[5][piece_positions[5].indexOf(5)] = 7;
                }
                
            } else if (moved_piece === 9) {
                if (from === 60 && to === 58) {
                    board[56] = 13;
                    board[59] = 0;
                    piece_positions[13][piece_positions[13].indexOf(59)] = 56;
                }
                if (from === 60 && to === 62) {
                    board[63] = 13;
                    board[61] = 0;
                    piece_positions[13][piece_positions[13].indexOf(61)] = 63;
                }
            }

            // undo the move
            piece_positions[moved_piece][piece_positions[moved_piece].indexOf(to)] = from;

            // undo en passant
            if (white_made_en_passant) {
                piece_positions[captured_piece].push(to + 8); 
                board[to + 8] = captured_piece;
                captured_piece = 0;
                board[to] = 0;
                board[from] = moved_piece;
            
            } else if (black_made_en_passant) {
                piece_positions[captured_piece].push(to - 8);
                board[to - 8] = captured_piece;
                captured_piece = 0;
                board[to] = 0;
                board[from] = moved_piece;
            
            } else if (captured_piece != 0) {
                piece_positions[captured_piece].push(to);
                board[from] = moved_piece;
                board[to] = captured_piece;
            
            }   else { // no capture here
                board[from] = moved_piece;
                board[to] = 0;
            }

            // if pawn promotion, remove the queen from piece_positions
            if ((moved_piece === 2 || moved_piece === 10) && (to < 8 || to > 55)) {
                piece_positions[6 + 8 * (turn)].splice(piece_positions[6 + 8 * (turn)].indexOf(to), 1);
                piece_positions[2 + 8 * (turn)].push(from);
            }

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





function set_piece_values () {
    // Create the piece values based on the bot's pov
    piece_value_prefix = pov === 1 ? 1 : -1; // since we are maximizing the bot's score, we want the bot's pieces to have a positive score
    piece_values = {
        1: 20000 * piece_value_prefix,
        2: 100 * piece_value_prefix,
        3: 320 * piece_value_prefix,
        4: 330 * piece_value_prefix,
        5: 500 * piece_value_prefix,
        6: 900 * piece_value_prefix,
        9: -20000 * piece_value_prefix,
        10: -100 * piece_value_prefix,
        11: -300 * piece_value_prefix,
        12: -300 * piece_value_prefix,
        13: -500 * piece_value_prefix,
        14: -900 * piece_value_prefix,
    }
}

function evaluate_board(search_captures = true) {
    if (search_captures) {
        if (turn === pov) {
            return -search_all_captures(-Infinity, Infinity);
        }
        return search_all_captures(-Infinity, Infinity);
    }

    let score = 0;
    let prefix = (pov === 1) ? 1 : -1;
    for (let i = 1; i < 15; i++) {
        const piece_indexes = piece_positions[i];
        for (let j = 0; j < piece_indexes.length; j++) {
            score += piece_values[i];
            score += prefix * square_bias[i][piece_indexes[j]];
        }

        if(i === 6){
            i = 8;
            prefix = -prefix; 
        }
    }
    return score;
}


function get_all_legal_moves(color, only_captures = false) {

    const moves = [];
    const base = color * 8;
    const old_turn = turn;
    turn = color;

    for (let i = 1; i < 7; i++) {
        const piece_indexes = piece_positions[base + i];
        for (let j = 0; j < piece_indexes.length; j++) {
            const piece_moves = get_legal_moves(piece_indexes[j], false, only_captures);
            for (let k = 0; k < piece_moves.length; k++) {
                moves.push([piece_indexes[j], piece_moves[k]]);
            }
        }
    }
    turn = old_turn;
    return moves;
}

function search_all_captures(alpha, beta, depth = 0) { // attempting to do it without the maximizing true or false 
    let evaluation = (turn === pov) ? -evaluate_board(false): evaluate_board(false); // do not search for captures here (false), just static evaluation

    if (evaluation >= beta) {
        return beta;
    }
    alpha = Math.max(alpha, evaluation);

    const capture_moves = get_all_legal_moves(turn, true);

    for (let i = 0; i < capture_moves.length; i++) {

        // COPY OF THE CODE FROM MINIMAX FOR SAVING THE BOARD STATE

        const move = capture_moves[i]; // TODO change the 0 to i later
        const moved_piece = board[move[0]];
        const from = move[0];
        const to = move[1];
        let captured_piece = board[to];

        // save the castling rights and en passant before the move
        const white_left_castle_copy = white_left_castle;
        const white_right_castle_copy = white_right_castle;
        const black_left_castle_copy = black_left_castle;
        const black_right_castle_copy = black_right_castle;
        const white_en_passant_copy = white_en_passant;
        const black_en_passant_copy = black_en_passant;

        // checking for en passant
        let white_made_en_passant = false;
        let black_made_en_passant = false;

        if (moved_piece === 10) {
            if ((to - from) % 8 != 0 && captured_piece === 0) {
                captured_piece = board[to + 8];
                white_made_en_passant = true;
            }
        } else if (moved_piece === 2) {
            if ((to - from) % 8 != 0 && captured_piece === 0) {
                captured_piece = board[to - 8];
                black_made_en_passant = true;
            }
        }


        // test on the first moves only

        // make the move
        move_piece(capture_moves[i][0], capture_moves[i][1], true);
        evaluation = -search_all_captures(-beta, -alpha, depth + 1);
        turn = (turn + 1) % 2;  // switching the turn back after the move_piece function switches it



        // Start undoing
                
        // undo castling rights
        white_left_castle = white_left_castle_copy;
        white_right_castle = white_right_castle_copy;
        black_left_castle = black_left_castle_copy;
        black_right_castle = black_right_castle_copy;
        // undo en passant flags
        
        white_en_passant = white_en_passant_copy;
        black_en_passant = black_en_passant_copy;

        // undo the rook move after castling
        if (moved_piece === 1) {
            if (from === 4 && to === 2) {
                board[0] = 5;
                board[3] = 0;
                piece_positions[5][piece_positions[5].indexOf(3)] = 0;
            }
            if (from === 4 && to === 6) {
                board[7] = 5;
                board[5] = 0;
                piece_positions[5][piece_positions[5].indexOf(5)] = 7;
            }
            
        } else if (moved_piece === 9) {
            if (from === 60 && to === 58) {
                board[56] = 13;
                board[59] = 0;
                piece_positions[13][piece_positions[13].indexOf(59)] = 56;
            }
            if (from === 60 && to === 62) {
                board[63] = 13;
                board[61] = 0;
                piece_positions[13][piece_positions[13].indexOf(61)] = 63;
            }
        }

        // undo the move
        piece_positions[moved_piece][piece_positions[moved_piece].indexOf(to)] = from;

        // undo en passant
        if (white_made_en_passant) {
            piece_positions[captured_piece].push(to + 8); 
            board[to + 8] = captured_piece;
            captured_piece = 0;
            board[to] = 0;
            board[from] = moved_piece;
        
        } else if (black_made_en_passant) {
            piece_positions[captured_piece].push(to - 8);
            board[to - 8] = captured_piece;
            captured_piece = 0;
            board[to] = 0;
            board[from] = moved_piece;
        
        } else if (captured_piece != 0) {
            piece_positions[captured_piece].push(to);
            board[from] = moved_piece;
            board[to] = captured_piece;
        
        }   else { // no capture here
            board[from] = moved_piece;
            board[to] = 0;
        }

        // if pawn promotion, remove the queen from piece_positions
        if ((moved_piece === 2 || moved_piece === 10) && (to < 8 || to > 55)) {
            piece_positions[6 + 8 * (turn)].splice(piece_positions[6 + 8 * (turn)].indexOf(to), 1);
            piece_positions[2 + 8 * (turn)].push(from);
        }


        if (evaluation >= beta) {
            return beta;
        }
        alpha = Math.max(alpha, evaluation);
    }

    return evaluation;
}

function order_moves(moves) {
    const ordered_moves = [];
    const captures = [];
    const non_captures = [];
    for (let i = 0; i < moves.length; i++) {
        if (board[moves[i][1]] != 0) {
            captures.push(moves[i]);
        } else {
            non_captures.push(moves[i]);
        }
    }
    ordered_moves.push(...captures);
    ordered_moves.push(...non_captures);
    return ordered_moves;
}