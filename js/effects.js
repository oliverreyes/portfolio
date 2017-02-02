function readyFunc(){
	var titleList = ["Software Developer", "UCSD Graduate", "Web Developer"]; 	
	var index = 0;
	function textChange(textList, i){
		$("#title")
			.slideUp(1000)
			.queue(function(){
				$(this).text(textList[i]).slideDown(1000);
				$(this).dequeue();
			})
	}
	setInterval(function(){ 
		textChange(titleList, index); 
		if (index < titleList.length-1) {
			index++;
		}
		else {
			index = 0;
		}
	}, 4000);	
}

$(window).scroll(navDisappear);

function navDisappear(){
	var navPos = 100;
	var scrollPos = $(window).scrollTop();
	var $nav = $(".navbar");
	if (scrollPos > navPos){
		$nav.fadeOut("slow");
	}
	else {
		$nav.fadeIn("slow");
	}
}

