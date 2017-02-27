var white_count = 0;
var red_count = 0;
// Create global mapping
var globalArray = [];
var coordArray = mapCoord(globalArray);
var myMap = new Map(coordArray);
console.log(myMap);


function main(){
	setBoard();
	setPieces();
	// CLICK NOT WORKING, ATTR IS UNDEFINED
}

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
	// create visual board
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
	// place objects on array board
	for (var r = 0; r < 8; r++){
		for (var c = 0; c < 8; c+=2){
			if (r == 0 || r == 2){
				window.boardArray[r][c+1] = new Checker("White", c+1, r); 
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
	// create visual pieces
	for (var i = 0; i < 24; i++){
		if (i < 12){
			$("#" + i).addClass("whitePiece");
		}
		else {
			$("#" + (i+8)).addClass("redPiece");
		} 
	}
	console.log(window.boardArray);	
}

function mapCoord(mapArray){
	var val = 0;
	for (var row = 0; row < 8; row++){
		var rowMod = row % 2;
		for (var col = 0; col < 8; col+=2){
			if (rowMod == 0){
				mapArray.push([[row, col+1], val]);
			}
			else {
				mapArray.push([[row, col], val]);
			}
			val++;
		}
	}
	return mapArray;
}

$(".board").on("click", ".black", function(){
	var id = $(this).attr("id");
	console.log(id);
});

/*
function selectPiece(){
	var id = this.id;
	var x = coordArray[0][0][0];
	var y = coordArray[0][0][1];

}
*/



function movePiece(){

}


