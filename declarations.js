const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const ctx = canvas.getContext("2d");

let pov = 1;
let bot = null;


// keep track of squares of individual pieces for speed
let piece_positions = {
    1: [4], // black king
    2: [8, 9, 10, 11, 12, 13, 14, 15], // black pawns
    3: [28, 6], // black knights
    4: [2, 5], // black bishops
    5: [0, 7], // black rooks
    6: [3], // black queens
    9: [60], // white king
    10: [48, 49, 50, 51, 52, 53, 54, 55], // white pawns
    11: [57, 62], // white knights
    12: [58, 61], // white bishops
    13: [56, 63], // white rooks
    14: [59], // white queens
    
};
let piece_values = {}

// 1D array for speed
// piece values: 0 = none, 1 = king, 2 = pawn, 3 = knight, 4 = bishop, 5 = rook, 6 = queen
// color values: 0 = black, 8 = white

let board = initialize_board();

// set these variables equal to square that can be en passanted
let white_en_passant = null;
let black_en_passant = null;


let white_left_castle = true;
let white_right_castle = true;
let black_left_castle = true;
let black_right_castle = true;


let turn = 1;


// images for all pieces
const black_king_image = new Image()
black_king_image.src = "images/black_king.png";
const black_pawn_image = new Image()
black_pawn_image.src = "images/black_pawn.png";
const black_knight_image = new Image()
black_knight_image.src = "images/black_knight.png";
const black_bishop_image = new Image()
black_bishop_image.src = "images/black_bishop.png";
const black_rook_image = new Image()
black_rook_image.src = "images/black_rook.png";
const black_queen_image = new Image()
black_queen_image.src = "images/black_queen.png";
const white_king_image = new Image()
white_king_image.src = "images/white_king.png";
const white_pawn_image = new Image()
white_pawn_image.src = "images/white_pawn.png";
const white_knight_image = new Image()
white_knight_image.src = "images/white_knight.png";
const white_bishop_image = new Image()
white_bishop_image.src = "images/white_bishop.png";
const white_rook_image = new Image()
white_rook_image.src = "images/white_rook.png";
const white_queen_image = new Image()
white_queen_image.src = "images/white_queen.png";



function initialize_board() {
let board = new Int8Array(64)

board[0] = 5;
board[1] = 3;
board[2] = 4;
board[3] = 6;
board[4] = 1;
board[5] = 4;
board[6] = 3;
board[7] = 5;

board[8] = 2;
board[9] = 2;
board[10] = 2;
board[11] = 2;
board[12] = 2;
board[13] = 2;
board[14] = 2;
board[15] = 2;

// +8 for white because binary maybe
board[63] = 5 + 8;
board[62] = 3 + 8;
board[61] = 4 + 8;
board[60] = 1 + 8;
board[59] = 6 + 8;
board[58] = 4 + 8;
board[57] = 3 + 8;
board[56] = 5 + 8;

board[55] = 2  + 8;
board[54] = 2  + 8;
board[53] = 2  + 8;
board[52] = 2  + 8;
board[51] = 2  + 8;
board[50] = 2  + 8;
board[49] = 2  + 8;
board[48] = 2  + 8;

// 0, 5, 4,  0,  1, 5,  3, 0,
// 2, 2, 0,  0,  0, 2,  2, 2,
// 0, 0, 0,  4,  0, 0,  0, 0,
// 6, 0, 2,  10, 2, 10, 10,
// 0, 0, 0,  0,  0, 14, 0, 0, 
// 0, 0, 10, 11, 0, 0,  0, 0, 
// 0, 0, 0,  0,  0, 0,  0, 0, 
//10, 0, 11, 9, 0, 0, 0, 0, 13]

piece_positions = {
    1: [4], // black king
    2: [8, 9, 10, 11, 12, 13, 14, 15], // black pawns
    3: [1, 6], // black knights
    4: [2, 5], // black bishops
    5: [0, 7], // black rooks
    6: [3], // black queens
    9: [60], // white king
    10: [48, 49, 50, 51, 52, 53, 54, 55], // white pawns
    11: [57, 62], // white knights
    12: [58, 61], // white bishops
    13: [56, 63], // white rooks
    14: [59], // white queens
    
};

return board
}
