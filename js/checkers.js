var white_count = 0;
var red_count = 0;

// Checker piece object
function Checker(team, x, y){
	this.team = team;
	this.x = x;
	this.y = y;
}

// Create board
function setBoard(){
	var nSpaces = 64;
	var $board = $(".board");
	var nBlack = 0;
	window.boardArray = [];
	// create 2D array
	for (var row = 0; row < 8; row++){
		window.boardArray[row] = []; 
		for (var col = 0; col < 8; col++){
			window.boardArray[row][col] = 0; 
		}
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

// Create pieces
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
				window.boardArray[r][c+1] = new Checker("White", c+1, r); //Insert object Piece here
				white_count++;
			}
			else if (r == 1){
				window.boardArray[r][c] = new Checker("White", c, r);
				white_count++;
			}
			else if (r == 5 || r == 7){
				window.boardArray[r][c] = new Checker("Red", c, r);
				red_count++;
			}
			else if (r == 6){
				window.boardArray[r][c+1] = new Checker("Red", c+1, r);
				red_count++;
			}
			
		}
	}
	console.log(window.boardArray);	
}

function getCoord(){

}

setBoard();
setPieces();
