function board_deep_copy(board) {
    board_copy = [];
    for (let i = 0; i < 8; i++){
        board_copy.push([]);
        for (let j = 0; j < 8; j++){
            if (board[i][j] != null){
                board_copy[i].push(board[i][j].deep_copy());
            } else {
                board_copy[i].push(null);
            }
        }
    }
    return board_copy;
}