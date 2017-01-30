function textChange(newText){

	$("#title").slideUp(800, function(){
		$(this).text(newText)
	}).slideDown();
	setTimeout(textChange("Software Developer"), 800);
}