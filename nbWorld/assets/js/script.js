$(document).ready(function() {
	/////// icons
	//$(".social li").find("a").css({opacity:0.6});
	$(".social li a").hover(function() {
		$(this).stop().animate({opacity:0.6 }, 400, 'easeOutExpo');		    
	},function(){
	    $(this).stop().animate({opacity:1 }, 400, 'easeOutExpo' );		   
	}); 

	

}); //
$(window).load(function() {
	//

}); //

