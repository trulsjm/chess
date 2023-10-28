



let move;
let moved_piece;
let from;
let to;
let captured_piece;


function make_move_test(turn) {
  const all_legal_moves = get_all_legal_moves(turn)
  move = all_legal_moves[Math.floor(Math.random() * all_legal_moves.length)];
  moved_piece = board[move[0]];
  from = move[0];
  to = move[1];
  captured_piece = board[to];

  // checking for en passant
  if (moved_piece === 10) {
      if ((to - from) % 8 != 0 && captured_piece === 0) {
          captured_piece = board[to - 8];
          
      }
  } else if (moved_piece === 2) {
      if ((to - from) % 8 != 0 && captured_piece === 0) {
          captured_piece = board[to + 8];
      }
    }
  
    move_piece(from, to, true);
    drawBoard();
}

function undo_move_test() {
    move_piece(to, from, true);
    board[to] = captured_piece;
    drawBoard();
}