
function setBoard(canvas){
	console.log("Called");
	var ctx = canvas.getContext("2d");
	// default numbers
	nCol = 8;
	nRow = 8;
	// square dimensions
	sHeight = canvas.height/nRow;
	sWidth = canvas.width/nCol;

	ctx.beginPath();
	for (var r = 0; r < nRow; r++){
		for (var c = 0; c < nCol; c+=2){
			if (r % 2 == 0) {
				ctx.rect((c+1)*sWidth, r*sHeight, sWidth, sHeight);
			}
			else {
				ctx.rect(c*sWidth, r*sHeight, sWidth, sHeight);
			}
			
		}
	}
	ctx.fill()
	ctx.closePath();

}

var board = document.getElementById("board");
setBoard(board);