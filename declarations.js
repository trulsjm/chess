const pieces_image = new Image();
pieces_image.src = "pieces.png";

let pov = 1;
let bot = null;

// temporary values for kings and board because of a circular dependency
let white_king = {
    row: 7,
    col: 4,
    color: 1,
    type: "king",
    value: 10000,
    image_coords: [10, 0]
}
let black_king = {
    row: 0,
    col: 4,
    color: 0,
    type: "king",
    value: 10000,
    image_coords: [10, 330]
}
let board = [
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,],
];

let white_left_castle = true;
let white_right_castle = true;
let black_left_castle = true;
let black_right_castle = true;


let turn = 1;
let selectedPiece = null;
let legal_moves = [];