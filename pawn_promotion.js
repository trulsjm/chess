let promotion_coords = [0, 0];

function pawn_promotion(board, search = false) {

    // check if the bot is the one moving
    if (search || turn != pov) {
        board[promotion_coords[0]][promotion_coords[1]] = new Piece(promotion_coords[0], promotion_coords[1], turn, "queen");
        turn = !turn;
        drawBoard();
        return;
    }

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
        board[promotion_coords[0]][promotion_coords[1]] = new Piece(promotion_coords[0], promotion_coords[1], turn, "queen");
        document.body.removeChild(choice_el);
        drawBoard();
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
        board[promotion_coords[0]][promotion_coords[1]] = new Piece(promotion_coords[0], promotion_coords[1], turn, "rook");
        document.body.removeChild(choice_el);
        drawBoard();
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
        board[promotion_coords[0]][promotion_coords[1]] = new Piece(promotion_coords[0], promotion_coords[1], turn, "bishop");
        document.body.removeChild(choice_el);
        drawBoard();
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
        // TODO fix this
        board[promotion_coords[0]][promotion_coords[1]] = new Piece(promotion_coords[0], promotion_coords[1], turn, "knight");
            bot.move(board);
        document.body.removeChild(choice_el);
        drawBoard();
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