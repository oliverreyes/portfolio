var white_count = 0;
var red_count = 0;
var red_turn = true;
var jump_flag = false;
var king_spaces = [0, 1, 2, 3, 28, 29, 30, 31];
var king_flag = false;
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
			if (checkerPiece == "redPiece" && red_turn){
				$(this).addClass("selected");
				var openIds = movesAvailable(currId);
				for (var i = 0; i < openIds.length; i++){
					$("#" + openIds[i]).parent().addClass("selected");
				}
				isSelected = true;
			}
			else if (checkerPiece == "whitePiece" && !red_turn) {
				$(this).addClass("selected");
				var openIds = movesAvailable(currId);
				for (var i = 0; i < openIds.length; i++){
					$("#" + openIds[i]).parent().addClass("selected");
				}
				isSelected = true;
			}
			
		}
	});	
	// Click function on selected pieces
	$(".board").on("click", ".selected", function(){
		if (isSelected){
			$(".black").removeClass("selected"); // reset board to black
			var nextId = $(this).find("div").attr("id");
			var jumpIndex = movePiece(currId, nextId);
			isSelected = false;
			// If jumped piece
			if (jumpIndex != -1){
				jumpPiece(jumpIndex);
				winCondition();
				// If promoted to king, turn ends
				if (king_flag == true){
					king_flag = false;
					return;
				}
				var checker = $(this).find("div").attr("class");
				jump_flag = true;
				// Check for continuous jumps
				if (checker == "redPiece" && !red_turn){
					var openIds = movesAvailable(nextId);
					// Check if available jumps
					if (openIds.length < 1){
						isSelected = false;
						jump_flag = false;
						return;
					}
					$(this).addClass("selected");
					for (var i = 0; i < openIds.length; i++){
						$("#" + openIds[i]).parent().addClass("selected");
					}
					currId = nextId;
					isSelected = true;
					jump_flag = false;
				}
				else if (checker == "whitePiece" && red_turn) {
					var openIds = movesAvailable(nextId);
					// Check if available jumps
					if (openIds.length < 1){
						isSelected = false;
						jump_flag = false;
						return;
					}
					$(this).addClass("selected");
					for (var i = 0; i < openIds.length; i++){
						$("#" + openIds[i]).parent().addClass("selected");
					}
					currId = nextId;
					isSelected = true;
					jump_flag = false;
				}
			}
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
			for (var j = -1; j < 2; j+=2){
				var newX = x+j;
				var newY = y+i;
				if (newX < 0 || newX > 7 || newY < 0 || newY > 7){
					continue;
				}
				if (window.boardArray[newY][newX] == 0){
					if (jump_flag){
						continue;
					}
					openSpaces.push(findIndex(coordArray, newY, newX));
				}
				else if (window.boardArray[newY][newX].team != current.team){
					// Edge cases
					var doubleX = newX+j;
					var doubleY = newY+i;
					if (doubleY < 0 || doubleY > 7 || doubleX < 0 || doubleX > 7){
						continue;
					}
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
			var yEdge = y-1;
			// Edge case
			if (newX < 0 || newX > 7 || yEdge < 0){
				continue;
			}
			// Open Space
			if (window.boardArray[y-1][newX] == 0){
				// If jump flag is true, ignore open spaces
				if (jump_flag){
					continue;
				}
				openSpaces.push(findIndex(coordArray, y-1, newX));
			}
			// Opposing Checker
			else if (window.boardArray[y-1][newX].team != current.team){
				var newY = y-2;
				// Edge case
				if (newY < 0){
					continue;
				}
				// Left jump
				if (i == -1){
					if (window.boardArray[newY][newX-1] == 0){
						openSpaces.push(findIndex(coordArray, newY, newX-1));
					}
				}
				else {
					if (window.boardArray[newY][newX+1] == 0){
						openSpaces.push(findIndex(coordArray, newY, newX+1));
					}
				}
			}
		}
	}
	else if (current.team == "White"){
		for (var i = -1; i < 2; i+=2){
			var newX = x+i; 
			var yEdge = y-1;
			// Edge case
			if (newX < 0 || newX > 7 || yEdge > 7){
				continue;
			}
			if (window.boardArray[y+1][newX] == 0){
				if (jump_flag){
					continue;
				}
				openSpaces.push(findIndex(coordArray, y+1, newX));
			}
			else if (window.boardArray[y+1][newX].team != current.team){
				var newY = y+2;
				// Edge case
				if (newY > 7){
					continue;
				}
				if (i == -1){
					if (window.boardArray[newY][newX-1] == 0){
						openSpaces.push(findIndex(coordArray, newY, newX-1));
					}
				}
				else {
					if (window.boardArray[newY][newX+1] == 0){
						openSpaces.push(findIndex(coordArray, newY, newX+1));
					}
				}
			}
		}
	}
	//console.log(openSpaces);
	return openSpaces;
}

// Move piece from current space to selected space, returns jumped piece
function movePiece(curr, next){
	var jumpIndex = -1;
	// Exit function if same space is selected
	if (curr == next){
		return jumpIndex;
	}
	var currY = coordArray[curr][0];
	var currX = coordArray[curr][1];
	var nextY = coordArray[next][0];
	var nextX = coordArray[next][1];
	var Ydiff = Math.abs(currY - nextY);
	if (Ydiff == 2){
		for (var i = 1; i < 7; i++){
			if ((i < currY && i > nextY) || (i > currY && i < nextY)){
				var jumpY = i;
			}
			else if ((i < currX && i > nextX) || (i > currX && i < nextX)){
				var jumpX = i;
			}
		}
		jumpIndex = findIndex(coordArray, jumpY, jumpX);
	}
	// Move piece to new spot, clear out old spot
	window.boardArray[nextY][nextX] = window.boardArray[currY][currX]; 
	window.boardArray[currY][currX] = 0;
	// If end of board reached, make king
	for (var k = 0; k < king_spaces.length; k++){
		if (king_spaces[k] == next){
			makeKing(nextX, nextY);
		}
	}
	// Move visual piece
	if ($("#" + curr).hasClass("redPiece")){
		$("#" + curr).removeClass("redPiece");
		$("#" + next).addClass("redPiece");
		if (window.boardArray[nextY][nextX].isKing == true){
			$("#" + curr + "> img").remove();
			$("#" + next).prepend("<img src='../static/crown_icon.png' class='king'/>");
		}
		red_turn = false;
	}
	else {
		$("#" + curr).removeClass("whitePiece");
		$("#" + next).addClass("whitePiece");
		if (window.boardArray[nextY][nextX].isKing == true){
			$("#" + curr + "> img").remove();
			$("#" + next).prepend("<img src='../static/crown_icon.png' class='king'/>");
		}
		red_turn = true;
	}
	return jumpIndex; // return captured piece
}

function jumpPiece(capIndex){
	var capY = coordArray[capIndex][0];
	var capX = coordArray[capIndex][1];
	//console.log(window.boardArray[capY][capX]);
	// Remove king symbol
	if (window.boardArray[capY][capX].isKing == true){
		$("#" + capIndex + "> img").remove();
	}
	// Remove captured piece from 2D array
	window.boardArray[capY][capX] = 0;
	// Visually remove captured piece, subtract from team count
	if ($("#" + capIndex).hasClass("redPiece")){
		$("#" + capIndex).removeClass("redPiece");
		red_count--;
	}
	else {
		$("#" + capIndex).removeClass("whitePiece");
		white_count--;
	}	
}

function makeKing(x, y){
	if (window.boardArray[y][x].isKing == false){
		window.boardArray[y][x].isKing = true;
		king_flag = true;
	}
}

function winCondition(){
	if (red_count == 0){
		alert("White wins!");
	}
	else if (white_count == 0){
		alert("Red wins!");
	}
}

