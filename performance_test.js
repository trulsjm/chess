



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

const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const array3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const array4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const array5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function for_loop_test() {
    let result = 0;
    const length1 = array1.length;
    for (let i = 0; i < length1; i++) {
        const length2 = array2.length;
        for (let j = 0; j < length2; j++) {
            const length3 = array3.length;
            for (let k = 0; k < length3; k++) {
                const length4 = array4.length;
                for (let l = 0; l < length4; l++) {
                    const length5 = array5.length;
                    for (let m = 0; m < length5; m++) {
                        result += array1[i] + array2[j] + array3[k] + array4[l] + array5[m];
                    }
                }
            }
        }
    }
    console.log(result);
}


function slow_for_loop_test() {
    let result = 0;
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            for (let k = 0; k < array3.length; k++) {
                for (let l = 0; l < array4.length; l++) {
                    for (let m = 0; m < array5.length; m++) {
                        result += array1[i] + array2[j] + array3[k] + array4[l] + array5[m];
                    }
                }
            }
        }
    }
    console.log(result);
}

// for_loop_test();
// slow_for_loop_test();