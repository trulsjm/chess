class Piece {
    constructor(row, col, color, type) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.type = type;
        this.image_coords = this.set_image_coords();
        this.left_en_passant = false;
        this.right_en_passant = false;
    }
    set_image_coords() {  
        // select a cut out of the image based on the piece's color and type
        let image_coords = [0, 0]
        if (this.color == 1) {
            image_coords[1] = 0;
        } else {
            image_coords[1] = 330; 
        }

        if (this.type == "rook") {
            image_coords[0] = 1340;
        }
        if (this.type == "knight") {
            image_coords[0] = 1010;
        }
        if (this.type == "bishop") {
            image_coords[0] = 676;
        }
        if (this.type == "queen") {
            image_coords[0] = 344;
        }
        if (this.type == "king") {
            image_coords[0] = 10;
        }
        if (this.type == "pawn") {
            image_coords[0] = 1670;
        }

        return image_coords;
    }
    
    get_legal_moves(board, check_check) {
        // return a list of legal moves for the piece
        let legal_moves = [];
        if (this.type == "rook") {
            legal_moves = this.get_rook_moves(board);
        }
        if (this.type == "knight") {
            legal_moves = this.get_knight_moves(board);
        }
        if (this.type == "bishop") {
            legal_moves = this.get_bishop_moves(board);
        }
        if (this.type == "queen") {
            legal_moves = this.get_queen_moves(board);
        }
        if (this.type == "king") {
            legal_moves = this.get_king_moves(board);
        }
        if (this.type == "pawn") {
            legal_moves = this.get_pawn_moves(board);
        }

        if (check_check) {
            // remove moves that would put the king in check
            let row = this.row;
            let col = this.col;
            let color = this.color;
            let king = (color == 1) ? white_king : black_king;
            // check backwards through the list so that removing an element doesn't mess up the index
            for (let i = legal_moves.length - 1; i >= 0; i--) {
                // check if the king is moving
                if (this.type == "king") {
                    king = new Piece(legal_moves[i][0], legal_moves[i][1], color, "king");
                }

                // check every board position to see if the king is in check
                let check = false;

                // maybe a dodgy solution
                const board_copy = JSON.parse(JSON.stringify(board));

                board_copy[row][col] = null;
                board_copy[legal_moves[i][0]][legal_moves[i][1]] = this;

                // change this so that we impersonate the king as every piece and see if it has legal moves that capture another similar piece
                const impersonators_list = ["rook", "bishop", "knight", "queen", "pawn"];
                for (let i = 0; i < impersonators_list.length; i++) {
                    const piece = new Piece(king.row, king.col, king.color, impersonators_list[i]);
                    let moves = piece.get_legal_moves(board_copy, false);
                    for (let j = 0; j < moves.length; j++) {
                        let enemy_piece = board_copy[moves[j][0]][moves[j][1]];
                        if (enemy_piece != null && enemy_piece.color != color && enemy_piece.type == impersonators_list[i]) {
                            check = true
                        }
                    }
                    
                }
                // for (let j = 0; j < 8; j++) {
                //     for (let k = 0; k < 8; k++) {
                //         if (board_copy[j][k] != null && board_copy[j][k].color != color) {
                //             //create new object for it to work
                //             const piece = new Piece(j, k, board_copy[j][k].color, board_copy[j][k].type);
                //             let moves = piece.get_legal_moves(board_copy, false);
                //             for (let l = 0; l < moves.length; l++) {
                //                 if (moves[l][0] == king.row && moves[l][1] == king.col) {
                //                     check = true;
                //                 }
                //             }
                //         }
                //     }
                // }

                if (check) {
                    legal_moves.splice(i, 1);
                }

            }
        }
        

        return legal_moves;
    }

    move(row, col) {
        // move the piece to the given row and column
        board[this.row][this.col] = null;
        let moved_piece = this;
        // check if the move was castling
        if (this.type == "king") {
            if (Math.abs(this.col - col) == 2) {
                if (col == 6) {
                    // move the rook to the right of the king
                    board[this.row][7] = null;
                    board[this.row][5] = new Piece(this.row, 5, this.color, "rook");
                } else {
                    // move the rook to the left of the king
                    board[this.row][0] = null;
                    board[this.row][3] = new Piece(this.row, 3, this.color, "rook");
                }
            
            }
            if (this.color == 1) {
                white_left_castle = false;
                white_right_castle = false;
            } else {
                black_left_castle = false;
                black_right_castle = false;
                
            }
        }
        // check if the move should give the opponent the option to en passant
        if (this.type == "pawn") {
            this.left_en_passant = false;
            this.right_en_passant = false;
            if (Math.abs(this.row - row) == 2) {
                if (this.col - 1 >= 0 && board[row][col - 1] != null && board[row][col - 1].type == "pawn" && board[row][col - 1].color != this.color) {
                    board[row][col - 1].right_en_passant = true;
                }
                if (this.col + 1 < 8 && board[row][col + 1] != null && board[row][col + 1].type == "pawn" && board[row][col + 1].color != this.color) {
                    board[row][col + 1].left_en_passant = true;
                }
            }
        }
        // check if the move was en passant
        if (this.type == "pawn" && this.col != col && board[row][col] == null) {
            board[this.row][col] = null;
        }

        // check if the move was a pawn promotion
        if (this.type == "pawn" && (row == 0 || row == 7)) {
            promotion_coords = [row, col];
            pawn_promotion();
            turn = (turn == 1) ? 0 : 1;
            return;
        }

        // check if the move was rook, then set the castle flag to false
        if (this.type == "rook") {
            if (this.color == 1) {
                if (this.col == 0) {
                    white_left_castle = false;
                } else if (this.col == 7) {
                    white_right_castle = false;
                }
            } else {
                if (this.col == 0) {
                    black_left_castle = false;
                } else if (this.col == 7) {
                    black_right_castle = false;
                }
            }
        }

        this.row = row;
        this.col = col;
        board[row][col] = moved_piece;

        
        drawBoard();

        // check for checkmate and stalemate
        let no_moves = true;
        let check = false;
        let color = (turn == 1) ? 0 : 1;
        let king = (turn == 1) ? black_king : white_king;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8 ; j++) {
                if (board[i][j] != null && board[i][j].color == color) {
                    let moves = board[i][j].get_legal_moves(board, true);
                    if (moves.length > 0) {
                        no_moves = false;
                    }
                }
                // check for check
                if (board[i][j] != null && board[i][j].color != color) {
                    const piece = board[i][j];
                    let moves = piece.get_legal_moves(board, false);
                    for (let l = 0; l < moves.length; l++) {
                        if (moves[l][0] == king.row && moves[l][1] == king.col) {
                            check = true;
                            break
                        }
                    }
                }
                if (check && !no_moves) {
                    break;
                }
            }
            if (check && !no_moves) {
                break;
            }
        }

        // delete the en passant flags
        let rank = (turn == 1) ? 3 : 4;
        for (let j = 0; j < 8 ; j++) {
            if (board[rank][j] != null && board[rank][j].type == "pawn") {
                board[rank][j].left_en_passant = false;
                board[rank][j].right_en_passant = false;
            }
        }

        if (no_moves) {
            let message = (check) ? "Checkmate" : "Stalemate";

            let checkmate_el = document.createElement("div");
            checkmate_el.style.position = "absolute";
            checkmate_el.style.display = "flex";
            checkmate_el.style.justifyContent = "center";
            checkmate_el.style.alignItems = "center";
            checkmate_el.style.flexDirection = "column";
            checkmate_el.style.left = "0";
            checkmate_el.style.width = "100%";
            checkmate_el.style.height = "100%";
            checkmate_el.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            checkmate_el.style.zIndex = "1";
            document.body.appendChild(checkmate_el);

            let checkmate_text = document.createElement("p");
            checkmate_text.style.color = "white";
            checkmate_text.style.fontSize = "50px";
            checkmate_text.style.marginBottom = "20px";
            checkmate_text.innerHTML = message;
            checkmate_el.appendChild(checkmate_text);

            let restart_button = document.createElement("button");
            restart_button.style.fontSize = "50px";
            restart_button.innerHTML = "Restart";
            restart_button.onclick = function() {
                document.body.removeChild(checkmate_el);
                restart();
            };
            checkmate_el.appendChild(restart_button);

            
            
            return;
        }


        turn = (turn == 1) ? 0 : 1;
    }

    get_rook_moves(board) {
        // return a list of legal moves for a rook
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        let i = 1;
        let j = 1;
        let k = 1;
        let l = 1;
        while (row + i < 8 && board[row + i][col] == null) {
            legal_moves.push([row + i, col]);
            i++;
        }
        if (row + i < 8 && board[row + i][col].color != color) {
            legal_moves.push([row + i, col]);
        }
        while (row - j >= 0 && board[row - j][col] == null) {
            legal_moves.push([row - j, col]);
            j++;
        }
        if (row - j >= 0 && board[row - j][col].color != color) {
            legal_moves.push([row - j, col]);
        }
        while (col + k < 8 && board[row][col + k] == null) {
            legal_moves.push([row, col + k]);
            k++;
        }
        if (col + k < 8 && board[row][col + k].color != color) {
            legal_moves.push([row, col + k]);
        }
        while (col - l >= 0 && board[row][col - l] == null) {
            legal_moves.push([row, col - l]);
            l++;
        }
        if (col - l >= 0 && board[row][col - l].color != color) {
            legal_moves.push([row, col - l]);
        }
        return legal_moves;
    }

    get_bishop_moves(board) {
        // return a list of legal moves for a bishop
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        let i = 1;
        let j = 1;
        let k = 1;
        let l = 1;
        while (row + i < 8 && col + i < 8 && board[row + i][col + i] == null) {
            legal_moves.push([row + i, col + i]);
            i++;
        }
        if (row + i < 8 && col + i < 8 && board[row + i][col + i].color != color) {
            legal_moves.push([row + i, col + i]);
        }
        while (row + j < 8 && col - j >= 0 && board[row + j][col - j] == null) {
            legal_moves.push([row + j, col - j]);
            j++;
        }
        if (row + j < 8 && col - j >= 0 && board[row + j][col - j].color != color) {
            legal_moves.push([row + j, col - j]);
        }
        while (row - k >= 0 && col + k < 8 && board[row - k][col + k] == null) {
            legal_moves.push([row - k, col + k]);
            k++;
        }
        if (row - k >= 0 && col + k < 8 && board[row - k][col + k].color != color) {
            legal_moves.push([row - k, col + k]);
        }
        while (row - l >= 0 && col - l >= 0 && board[row - l][col - l] == null) {
            legal_moves.push([row - l, col - l]);
            l++;
        }
        if (row - l >= 0 && col - l >= 0 && board[row - l][col - l].color != color) {
            legal_moves.push([row - l, col - l]);
        }
        return legal_moves;
    }

    get_knight_moves(board) {
        // return a list of legal moves for a knight
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        let moves = [[row + 2, col + 1], [row + 2, col - 1], [row - 2, col + 1], [row - 2, col - 1], [row + 1, col + 2], [row - 1, col + 2], [row + 1, col - 2], [row - 1, col - 2]];
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] >= 0 && moves[i][0] < 8 && moves[i][1] >= 0 && moves[i][1] < 8) {
                if (board[moves[i][0]][moves[i][1]] == null || board[moves[i][0]][moves[i][1]].color != color) {
                    legal_moves.push(moves[i]);
                }
            }
        }
        return legal_moves;
    }
    get_queen_moves(board) {
        // return a list of legal moves for a queen
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        let i = 1;
        let j = 1;
        let k = 1;
        let l = 1;
        let m = 1;
        let n = 1;
        let o = 1;
        let p = 1;
        while (row + i < 8 && board[row + i][col] == null) {
            legal_moves.push([row + i, col]);
            i++;
        }
        if (row + i < 8 && board[row + i][col].color != color) {
            legal_moves.push([row + i, col]);
        }
        while (row - j >= 0 && board[row - j][col] == null) {
            legal_moves.push([row - j, col]);
            j++;
        }
        if (row - j >= 0 && board[row - j][col].color != color) {
            legal_moves.push([row - j, col]);
        }
        while (col + k < 8 && board[row][col + k] == null) {
            legal_moves.push([row, col + k]);
            k++;
        }
        if (col + k < 8 && board[row][col + k].color != color) {
            legal_moves.push([row, col + k]);
        }
        while (col - l >= 0 && board[row][col - l] == null) {
            legal_moves.push([row, col - l]);
            l++;
        }
        if (col - l >= 0 && board[row][col - l].color != color) {
            legal_moves.push([row, col - l]);
        }
        while (row + m < 8 && col + m < 8 && board[row + m][col + m] == null) {
            legal_moves.push([row + m, col + m]);
            m++;
        }
        if (row + m < 8 && col + m < 8 && board[row + m][col + m].color != color) {
            legal_moves.push([row + m, col + m]);
        }
        while (row + n < 8 && col - n >= 0 && board[row + n][col - n] == null) {
            legal_moves.push([row + n, col - n]);
            n++;
        }
        if (row + n < 8 && col - n >= 0 && board[row + n][col - n].color != color) {
            legal_moves.push([row + n, col - n]);
        }
        while (row - o >= 0 && col + o < 8 && board[row - o][col + o] == null) {
            legal_moves.push([row - o, col + o]);
            o++;
        }
        if (row - o >= 0 && col + o < 8 && board[row - o][col + o].color != color) {
            legal_moves.push([row - o, col + o]);
        }
        while (row - p >= 0 && col - p >= 0 && board[row - p][col - p] == null) {
            legal_moves.push([row - p, col - p]);
            p++;
        }
        if (row - p >= 0 && col - p >= 0 && board[row - p][col - p].color != color) {
            legal_moves.push([row - p, col - p]);
        }
        return legal_moves;
    }

    get_king_moves(board) {
        // return a list of legal moves for a king
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        let moves = [[row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1], [row + 1, col + 1], [row + 1, col - 1], [row - 1, col + 1], [row - 1, col - 1]];
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] >= 0 && moves[i][0] < 8 && moves[i][1] >= 0 && moves[i][1] < 8) {
                if (board[moves[i][0]][moves[i][1]] == null || board[moves[i][0]][moves[i][1]].color != color) {
                    legal_moves.push(moves[i]);
                }
            }
        }
        // check if the king can castle
        if (color == 1) {
            if (white_right_castle && row == 7 && col == 4 && board[7][7] != null && board[7][7].type == "rook" && board[7][7].color == 1 && board[7][5] == null && board[7][6] == null) {
                legal_moves.push([7, 6]);
            }
            if (white_left_castle && row == 7 && col == 4 && board[7][0] != null && board[7][0].type == "rook" && board[7][0].color == 1 && board[7][1] == null && board[7][2] == null && board[7][3] == null) {
                legal_moves.push([7, 2]);
            }
        } else {
            if (black_right_castle && row == 0 && col == 4 && board[0][7] != null && board[0][7].type == "rook" && board[0][7].color == 0 && board[0][5] == null && board[0][6] == null) {
                legal_moves.push([0, 6]);
            }
            if (black_left_castle && row == 0 && col == 4 && board[0][0] != null && board[0][0].type == "rook" && board[0][0].color == 0 && board[0][1] == null && board[0][2] == null && board[0][3] == null) {
                legal_moves.push([0, 2]);
            }
        }
        return legal_moves;
    }

    get_pawn_moves(board) {
        // return a list of legal moves for a pawn
        let legal_moves = [];
        let row = this.row;
        let col = this.col;
        let color = this.color;
        if (color == 1) {
            if (row == 6 && board[row - 1][col] == null && board[row - 2][col] == null) {
                legal_moves.push([row - 2, col]);
            }
            if (row - 1 >= 0 && board[row - 1][col] == null) {
                legal_moves.push([row - 1, col]);
            }
            if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] != null && board[row - 1][col - 1].color != color) {
                legal_moves.push([row - 1, col - 1]);
            }
            if (row - 1 >= 0 && col + 1 < 8 && board[row - 1][col + 1] != null && board[row - 1][col + 1].color != color) {
                legal_moves.push([row - 1, col + 1]);
            }
        } else {
            if (row == 1 && board[row + 1][col] == null && board[row + 2][col] == null) {
                legal_moves.push([row + 2, col]);
            }
            if (row + 1 < 8 && board[row + 1][col] == null) {
                legal_moves.push([row + 1, col]);
            }
            if (row + 1 < 8 && col - 1 >= 0 && board[row + 1][col - 1] != null && board[row + 1][col - 1].color != color) {
                legal_moves.push([row + 1, col - 1]);
            }
            if (row + 1 < 8 && col + 1 < 8 && board[row + 1][col + 1] != null && board[row + 1][col + 1].color != color) {
                legal_moves.push([row + 1, col + 1]);
            }
        }
        // check if the pawn can en passant
        if (color == 1) {
            if (this.right_en_passant) {
                legal_moves.push([row - 1, col + 1]);
            }
            if (this.left_en_passant) {
                legal_moves.push([row - 1, col - 1]);
            }
        } else {
            if (this.right_en_passant) {
                legal_moves.push([row + 1, col + 1]);
            }
            if (this.left_en_passant) {
                legal_moves.push([row + 1, col - 1]);
            }
        }
        return legal_moves;
    }
}

