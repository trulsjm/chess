function pawn_promotion(square) {

    // create a choice block for the user to choose which piece to promote to
    let choice_el = document.createElement("div");
    choice_el.id = "choice";
    choice_el.style.position = "absolute";
    choice_el.style.display = "flex";
    choice_el.style.justifyContent = "center";
    choice_el.style.alignItems = "center";
    choice_el.style.top = "0";
    choice_el.style.left = "0";
    choice_el.style.width = "100%";
    choice_el.style.height = "100%";
    choice_el.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    choice_el.style.zIndex = "1";

    // clickable create a div for each piece
    let queen = document.createElement("div");
    queen.style.display = "flex";
    queen.style.justifyContent = "center";
    queen.style.alignItems = "center";
    queen.style.width = "100px";
    queen.style.height = "100px";
    queen.style.margin = "20px";
    queen.style.backgroundColor = "white";
    queen.style.backgroundImage
    queen.style.borderRadius = "50%";
    queen.style.zIndex = "2";
    queen.onclick = function() {
        make_promotion(square, 6 + 8 * (turn), choice_el);
    };
    queen_image = document.createElement("img");
    if (turn) {
        queen_image.src = "images/white_queen.png";

    } else {
        queen_image.src = "images/black_queen.png";
    }
    queen_image.style.width = "80px";
    queen_image.style.height = "80px";
    queen.appendChild(queen_image);
    choice_el.appendChild(queen);

    let rook = document.createElement("div");
    rook.style.display = "flex";
    rook.style.justifyContent = "center";
    rook.style.alignItems = "center";
    rook.style.width = "100px";
    rook.style.height = "100px";
    rook.style.margin = "20px";
    rook.style.backgroundColor = "white";
    rook.style.borderRadius = "50%";
    rook.style.zIndex = "2";
    rook.onclick = function() {
        make_promotion(square, 5 + 8 * (turn), choice_el);
    };
    rook_image = document.createElement("img");
    if (turn) {
        rook_image.src = "images/white_rook.png";

    } else {
        rook_image.src = "images/black_rook.png";
    }
    rook_image.style.width = "80px";
    rook_image.style.height = "80px";
    rook.appendChild(rook_image);
    choice_el.appendChild(rook);

    let bishop = document.createElement("div");
    bishop.style.display = "flex";
    bishop.style.justifyContent = "center";
    bishop.style.alignItems = "center";
    bishop.style.width = "100px";
    bishop.style.height = "100px";
    bishop.style.margin = "20px";
    bishop.style.backgroundColor = "white";
    bishop.style.borderRadius = "50%";
    bishop.style.zIndex = "2";
    bishop.onclick = function() {
        make_promotion(square, 4 + 8 * (turn), choice_el);
    };
    bishop_image = document.createElement("img");
    if (turn) {
        bishop_image.src = "images/white_bishop.png";

    } else {
        bishop_image.src = "images/black_bishop.png";
    }
    bishop_image.style.width = "80px";
    bishop_image.style.height = "80px";
    bishop.appendChild(bishop_image);
    choice_el.appendChild(bishop);

    let knight = document.createElement("div");
    knight.style.display = "flex";
    knight.style.justifyContent = "center";
    knight.style.alignItems = "center";
    knight.style.width = "100px";
    knight.style.height = "100px";
    knight.style.margin = "20px";
    knight.style.backgroundColor = "white";
    knight.style.borderRadius = "50%";
    knight.style.zIndex = "2";
    knight.onclick = function() {
        make_promotion(square, 3 + 8 * (turn), choice_el);
    };
    knight_image = document.createElement("img");
    if (turn) {
        knight_image.src = "images/white_knight.png";

    } else {
        knight_image.src = "images/black_knight.png";
    }
    knight_image.style.width = "80px";
    knight_image.style.height = "80px";
    knight.appendChild(knight_image);
    choice_el.appendChild(knight);




    document.body.appendChild(choice_el);

}

function make_promotion(square, piece, choice_el) {
    board[square] = piece;
    piece_positions[piece].push(square);

    document.body.removeChild(choice_el);
    drawBoard();
    turn = !turn;
    // make the bot move
    if (turn != pov) {
        bot_move();
    }
}