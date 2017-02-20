// create board
function setBoard(){
	var nSpaces = 64;
	var $board = $(".board");
	var nBlack = 0;
	for (var i = 0; i < nSpaces; i++){
		var colorIndex = Math.floor(i / 8 + i) % 2;
		if (colorIndex == 0){
			$board.append("<div class='white'></div>");
		}
		else {
			$board.append("<div class='black'><div id='" + nBlack +"'></div></div>");
			nBlack++;
		}
	}
}

// create pieces
function setPieces(){
	for (var i = 0; i < 24; i++){
		if (i < 12){
			$("#" + i).addClass("whitePiece");
		}
		else {
			$("#" + (i+8)).addClass("redPiece");
		} 
	}
}

setBoard();
setPieces();
