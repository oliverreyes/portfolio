
// create board
function setBoard(){
	var nSpaces = 64;
	var $board = $(".board");
	var nBlack = 0;
	window.boardArray = [];
	// create 2D array
	for (var j = 0; j < 8; j++){
		window.boardArray[j] = []; 
	}

	for (var i = 0; i < nSpaces; i++){
		var num = Math.floor(i / 8 + i);
		var isEven =  num % 2;
		if (isEven == 0){
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

	for (var r = 0; r < 8; r++){
		for (var c = 0; c < 8; c+=2){
			if (r == 0 || r == 2){
				window.boardArray[r][c+1] = 0;
			}
			else if (r == 1){
				window.boardArray[r][c] = 0;
			}
			else if (r == 5 || r == 7){
				window.boardArray[r][c] = 1;
			}
			else if (r == 6){
				window.boardArray[r][c+1] = 1;
			}
			
		}
	}
	console.log(window.boardArray);
	
}

function getCoord(){

}

setBoard();
setPieces();
