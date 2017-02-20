
function setBoard(){
	var nSpaces = 64;
	var $board = $(".board");
	for (var i = 0; i < nSpaces; i++) {
		var colorIndex = Math.floor(i / 8 + i) % 2;
		if (colorIndex == 0) {
			$board.append("<div class='white' id=" + i +"></div>");
		}
		else {
			$board.append("<div class='black' id=" + i +"></div>");
		}
	}
}

function setPieces(canvas){

}

setBoard();
