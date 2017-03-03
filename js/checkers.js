var white_count = 0;
var red_count = 0;
// Create global mapping
var globalArray = []; // index is visual board number, value is coords
var coordArray = mapCoord(globalArray);



function main(){
	setBoard();
	setPieces();
}

// Checker piece object
function Checker(team, x, y, isKing){
	this.team = team;
	this.x = x;
	this.y = y;
	this.isKing = isKing;
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
				window.boardArray[r][c+1] = new Checker("White", c+1, r, false); 
				white_count++;
			}
			else if (r == 1){
				window.boardArray[r][c] = new Checker("White", c, r, false);
				white_count++;
			}
			else if (r == 5 || r == 7){
				window.boardArray[r][c] = new Checker("Red", c, r, false);
				red_count++;
			}
			else if (r == 6){
				window.boardArray[r][c+1] = new Checker("Red", c+1, r, false);
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
	//console.log(window.boardArray);	
}

// Map index of coordinates in array to visual board space number
function mapCoord(mapArray){
	for (var row = 0; row < 8; row++){
		var rowMod = row % 2;
		for (var col = 0; col < 8; col+=2){
			if (rowMod == 0){
				mapArray.push([row, col+1]);
			}
			else {
				mapArray.push([row, col]);
			}
		}
	}
	return mapArray;
}

// Use coordinates to find index of space
function findIndex(arr, y, x){
	for (var i = 0; i < arr.length; i++){
		if (arr[i][0] == y && arr[i][1] == x){
			return i;
		}
	}
}

// On ready function
$(function(){
	var isSelected = false;
	var currId = 0;
	// Click function, graphic stuff
	$(".board").on("click", ".black", function(){
		if (!isSelected){
			$(".black").removeClass("selected"); // reset board to black
			currId = $(this).find("div").attr("id");
			var checkerPiece = $(this).find("div").attr("class");
			if (checkerPiece == "redPiece" || checkerPiece == "whitePiece"){
				$(this).addClass("selected");
				var openIds = movesAvailable(currId);
				for (var i = 0; i < openIds.length; i++){
					$("#" + openIds[i]).parent().addClass("selected");
				}
				isSelected = true;
			}
			else {
				console.log("No piece to move there bud");
			}
		}
	});	
	$(".board").on("click", ".selected", function(){
		if (isSelected){
			$(".black").removeClass("selected"); // reset board to black
			var nextId = $(this).find("div").attr("id");
			movePiece(currId, nextId);
			isSelected = false;
		}
	});
})


// Receives id of space, returns available spaces
function movesAvailable(id){
	var openSpaces = [];
	var y = coordArray[id][0];
	var x = coordArray[id][1];
	var current = window.boardArray[y][x];
	if (current.isKing == true){
		for (var i = -1; i < 2; i+=2){
			for (var j = -1; j > 2; j+=2){
				var newX = x+j;
				var newY = y+i;
				// UNTESTED
				if (newX < 0 || newX > 7 || newY < 0 || newY > 7){
					continue;
				}
				if (window.boardArray[newY][newX] == 0){
					openSpaces.push(findIndex(coordArray, newY, newX));
				}
				else if (window.boardArray[newY][newX].team != current.team){
					// top left
					if (i == -1 && j == -1){
						if (window.boardArray[newY-1][newX-1] == 0){
							openSpaces.push(findIndex(coordArray, newY-1, newX-1));
						}
					}
					else if (i == -1 && j == 1){
						if (window.boardArray[newY-1][newX+1] == 0){
							openSpaces.push(findIndex(coordArray, newY-1, newX+1));
						}
					}
					else if (i == 1 && j == -1){
						if (window.boardArray[newY+1][newX-1] == 0){
							openSpaces.push(findIndex(coordArray, newY+1, newX-1));
						}
					}
					else {
						if (window.boardArray[newY+1][newX+1] == 0){
							openSpaces.push(findIndex(coordArray, newY+1, newX+1));
						}
					}
				}
			}
		}
	}
	else if (current.team == "Red"){
		for (var i = -1; i < 2; i+=2){
			var newX = x+i; 
			// Edge case
			if (newX < 0 || newX > 7){
				continue;
			}
			// Open Space
			if (window.boardArray[y-1][newX] == 0){
				openSpaces.push(findIndex(coordArray, y-1, newX));
			}
			// Opposing Checker
			else if (window.boardArray[y-1][newX].team != current.team){
				// Left jump
				if (i == -1){
					if (window.boardArray[y-2][newX-1] == 0){
						openSpaces.push(findIndex(coordArray, y-2, newX-1));
					}
				}
				else {
					if (window.boardArray[y-2][newX+1] == 0){
						openSpaces.push(findIndex(coordArray, y-2, newX+1));
					}
				}
			}
		}
	}
	else if (current.team == "White"){
		for (var i = -1; i < 2; i+=2){
			var newX = x+i; 
			// Edge case
			if (newX < 0 || newX > 7){
				continue;
			}
			if (window.boardArray[y+1][newX] == 0){
				openSpaces.push(findIndex(coordArray, y+1, newX));
			}
			// CHANGE
			else if (window.boardArray[y+1][newX].team != current.team){
				if (i == -1){
					if (window.boardArray[y+2][newX-1] == 0){
						openSpaces.push(findIndex(coordArray, y+2, newX-1));
					}
				}
				else {
					if (window.boardArray[y+2][newX+1] == 0){
						openSpaces.push(findIndex(coordArray, y+2, newX+1));
					}
				}
			}
		}
	}
	console.log(openSpaces);
	return openSpaces;
}

// Move piece from current space to selected space
function movePiece(curr, next){
	// Exit function if same space is selected
	if (curr == next){
		return;
	}
	var currY = coordArray[curr][0];
	var currX = coordArray[curr][1];
	var nextY = coordArray[next][0];
	var nextX = coordArray[next][1];
	// Move piece to new spot, clear out old spot
	window.boardArray[nextY][nextX] = window.boardArray[currY][currX]; 
	window.boardArray[currY][currX] = 0;
	// Move visual piece
	if ($("#" + curr).hasClass("redPiece")){
		$("#" + curr).removeClass("redPiece");
		$("#" + next).addClass("redPiece");
	}
	else {
		$("#" + curr).removeClass("whitePiece");
		$("#" + next).addClass("whitePiece");
	}
}


