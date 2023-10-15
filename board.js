const canvas = document.getElementById("canvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const squareSize = canvasWidth / 8;

function drawBoard() {
    // Draw a chessboard on the canvas element
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#4c3228";
        // Draw the board from black's perspective
        for (let i = 7; i >= 0; i--) {
            for (let j = 1- (i % 2); j < 8; j += 2) {
                ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
            }
        }
    
    // Draw the pieces on the canvas element
    if (pov == 1) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = board[i][j];
                if (piece != null) {
                    // draw the piece
                    let image_coords = piece.image_coords;
                    ctx.drawImage(pieces_image, image_coords[0]-30, image_coords[1]-14, 300, 300, j * squareSize, i * squareSize, squareSize, squareSize);
                }
            }
        }
    } else {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = board[7-i][7-j];
                if (piece != null) {
                    // draw the piece
                    let image_coords = piece.image_coords;
                    ctx.drawImage(pieces_image, image_coords[0]-30, image_coords[1]-14, 300, 300, j * squareSize, i * squareSize, squareSize, squareSize);
                }
            }
        }
    }
}

function draw_piece(piece, row, col) {
    let image_coords = piece.image_coords;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(pieces_image, image_coords[0]-30, image_coords[1]-14, 300, 300, col * squareSize, row * squareSize, squareSize, squareSize);
}