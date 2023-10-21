function test_get_all_legal_moves(board, color) {
    const bot = new Chess_bot(color);
    const legal_moves = bot.get_all_legal_moves(board, color);

};

function test_evaluate_board(board) {
    const bot = new Chess_bot(1);
    const score = bot.evaluate_board(board);
}

function test_move(board) {
    const bot = new Chess_bot(1);
    bot.move(board);
}




let test_board = [
            [new Piece(0, 0, 0, "rook"), new Piece(0, 1, 0, "knight"), new Piece(0, 2, 0, "bishop"), new Piece(0, 3, 0, "queen"), new Piece(0, 4, 0, "king"), new Piece(0, 5, 0, "bishop"), new Piece(0, 6, 0, "knight"), new Piece(0, 7, 0, "rook")],
            [new Piece(1, 0, 0, "pawn"), new Piece(1, 1, 0, "pawn"), new Piece(1, 2, 0, "pawn"), new Piece(1, 3, 0, "pawn"), new Piece(1, 4, 0, "pawn"), new Piece(1, 5, 0, "pawn"), new Piece(1, 6, 0, "pawn"), new Piece(1, 7, 0, "pawn")],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Piece(6, 0, 1, "pawn"), new Piece(6, 1, 1, "pawn"), new Piece(6, 2, 1, "pawn"), new Piece(6, 3, 1, "pawn"), new Piece(6, 4, 1, "pawn"), new Piece(6, 5, 1, "pawn"), new Piece(6, 6, 1, "pawn"), new Piece(6, 7, 1, "pawn")],
            [new Piece(7, 0, 1, "rook"), new Piece(7, 1, 1, "knight"), new Piece(7, 2, 1, "bishop"), new Piece(7, 3, 1, "queen"), new Piece(7, 4, 1, "king"), new Piece(7, 5, 1, "bishop"), new Piece(7, 6, 1, "knight"), new Piece(7, 7, 1, "rook")],
            ];
        

// test_get_all_legal_moves(test_board, 1);