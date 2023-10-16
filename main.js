
const white_king = new Piece(7, 4, 1, "king");
const black_king = new Piece(0, 4, 0, "king");
let board = [
            [new Piece(0, 0, 0, "rook"), new Piece(0, 1, 0, "knight"), new Piece(0, 2, 0, "bishop"), new Piece(0, 3, 0, "queen"), black_king, new Piece(0, 5, 0, "bishop"), new Piece(0, 6, 0, "knight"), new Piece(0, 7, 0, "rook")],
            [new Piece(1, 0, 0, "pawn"), new Piece(1, 1, 0, "pawn"), new Piece(1, 2, 0, "pawn"), new Piece(1, 3, 0, "pawn"), new Piece(1, 4, 0, "pawn"), new Piece(1, 5, 0, "pawn"), new Piece(1, 6, 0, "pawn"), new Piece(1, 7, 0, "pawn")],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Piece(6, 0, 1, "pawn"), new Piece(6, 1, 1, "pawn"), new Piece(6, 2, 1, "pawn"), new Piece(6, 3, 1, "pawn"), new Piece(6, 4, 1, "pawn"), new Piece(6, 5, 1, "pawn"), new Piece(6, 6, 1, "pawn"), new Piece(6, 7, 1, "pawn")],
            [new Piece(7, 0, 1, "rook"), new Piece(7, 1, 1, "knight"), new Piece(7, 2, 1, "bishop"), new Piece(7, 3, 1, "queen"), white_king, new Piece(7, 5, 1, "bishop"), new Piece(7, 6, 1, "knight"), new Piece(7, 7, 1, "rook")],
            ];

const pieces_image = new Image();
pieces_image.src = "pieces.png";
pieces_image.onload = function() {
    drawBoard();
};

let pov = 1;

// first ask if the player wants to play as white or black
ask_pov();

let white_left_castle = true;
let white_right_castle = true;
let black_left_castle = true;
let black_right_castle = true;


let turn = 1;
let selectedPiece = null;
let legal_moves = [];


// listen to clicks on the canvas and get the index of the square that was clicked
canvas.addEventListener("click", function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let row = Math.floor(y / squareSize);
    let col = Math.floor(x / squareSize);
    if (selectedPiece != null) {
        // check if the clicked square is a legal move
        //check if the clicked square is a new piece of the same color
        if (pov == 1) {
            if (board[row][col] != null && board[row][col].color == selectedPiece.color) {
                selectedPiece = board[row][col];
            } else {
                let legal = false;
                for (let i = 0; i < legal_moves.length; i++) {
                    if (row == legal_moves[i][0] && col == legal_moves[i][1]) {
                        legal = true;
                        break;
                    }
                }
                if (!legal) {
                    selectedPiece = null;
                    drawBoard();
                    return;
                }
                selectedPiece.move(row, col);
                selectedPiece = null;
    
                return;
            }  
        } else {
            if (board[7-row][7-col] != null && board[7-row][7-col].color == selectedPiece.color) {
                selectedPiece = board[7-row][7-col];
            } else {
                let legal = false;
                for (let i = 0; i < legal_moves.length; i++) {
                    if (7-row == legal_moves[i][0] && 7-col == legal_moves[i][1]) {
                        legal = true;
                        break;
                    }
                }
                if (!legal) {
                    selectedPiece = null;
                    drawBoard();
                    return;
                }
                selectedPiece.move(7-row, 7-col);
                selectedPiece = null;
    
                return;
            }
        }

    }
    
    if (pov == 1) {
        selectedPiece = board[row][col];
    } else {
        selectedPiece = board[7-row][7-col];
    }

    if (selectedPiece == null || selectedPiece.color != turn) {
        selectedPiece = null;
        return;
    }

    legal_moves = selectedPiece.get_legal_moves(board, true);

    // mark the selected square with an orange background
    drawBoard();
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF9900";
    ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    draw_piece(selectedPiece, row, col);
    // print a yellow circle on each legal move
    ctx.fillStyle = "#FF9900";
    if (pov == 1) {
        for (let i = 0; i < legal_moves.length; i++) {
            ctx.beginPath();
            ctx.arc(legal_moves[i][1] * squareSize + squareSize / 2, legal_moves[i][0] * squareSize + squareSize / 2, squareSize / 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else {
        for (let i = 0; i < legal_moves.length; i++) {
            ctx.beginPath();
            ctx.arc((7 - legal_moves[i][1]) * squareSize + squareSize / 2, (7 - legal_moves[i][0]) * squareSize + squareSize / 2, squareSize / 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
});

function restart() {
board = [
    [new Piece(0, 0, 0, "rook"), new Piece(0, 1, 0, "knight"), new Piece(0, 2, 0, "bishop"), new Piece(0, 3, 0, "queen"), new Piece(0, 4, 0, "king"), new Piece(0, 5, 0, "bishop"), new Piece(0, 6, 0, "knight"), new Piece(0, 7, 0, "rook")],
    [new Piece(1, 0, 0, "pawn"), new Piece(1, 1, 0, "pawn"), new Piece(1, 2, 0, "pawn"), new Piece(1, 3, 0, "pawn"), new Piece(1, 4, 0, "pawn"), new Piece(1, 5, 0, "pawn"), new Piece(1, 6, 0, "pawn"), new Piece(1, 7, 0, "pawn")],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Piece(6, 0, 1, "pawn"), new Piece(6, 1, 1, "pawn"), new Piece(6, 2, 1, "pawn"), new Piece(6, 3, 1, "pawn"), new Piece(6, 4, 1, "pawn"), new Piece(6, 5, 1, "pawn"), new Piece(6, 6, 1, "pawn"), new Piece(6, 7, 1, "pawn")],
    [new Piece(7, 0, 1, "rook"), new Piece(7, 1, 1, "knight"), new Piece(7, 2, 1, "bishop"), new Piece(7, 3, 1, "queen"), new Piece(7, 4, 1, "king"), new Piece(7, 5, 1, "bishop"), new Piece(7, 6, 1, "knight"), new Piece(7, 7, 1, "rook")],
    ];


drawBoard();

white_left_castle = true;
white_right_castle = true;
black_left_castle = true;
black_right_castle = true;

turn = 1;
selectedPiece = null;
legal_moves = [];
ask_pov();
}

function ask_pov() {
    let choice_element = document.createElement("div");
choice_element.style.position = "absolute";
choice_element.style.display = "flex";
choice_element.style.flexDirection = "column";
choice_element.style.justifyContent = "center";
choice_element.style.alignItems = "center";
choice_element.style.width = "100%";
choice_element.style.height = "100%";
choice_element.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
choice_element.style.zIndex = "1";

let choice_text = document.createElement("div");
choice_text.style.color = "white";
choice_text.style.fontSize = "40px";
choice_text.innerHTML = "Choose your color";
choice_element.appendChild(choice_text);

let div = document.createElement("div");
div.style.width = "400px";
div.style.height = "200px";
div.style.display = "flex";
div.style.justifyContent = "center";
div.style.alignItems = "center";


let white = document.createElement("div");
white.style.width = "100px";
white.style.height = "100px";
white.style.margin = "20px";
white.style.backgroundColor = "white";
white.style.borderRadius = "50%";
white.style.zIndex = "2";
white.onclick = function() {
    document.body.removeChild(choice_element);
    pov = 1;
    drawBoard();
};

let black = document.createElement("div");
black.style.width = "100px";
black.style.height = "100px";
black.style.margin = "20px";
black.style.backgroundColor = "black";
black.style.borderRadius = "50%";
black.style.zIndex = "2";
black.onclick = function() {
    document.body.removeChild(choice_element);
    pov = 0;
    drawBoard();
};

div.appendChild(white);
div.appendChild(black);
choice_element.appendChild(div);
document.body.appendChild(choice_element);
}