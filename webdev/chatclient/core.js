$(function(){

});

//menu toggles
$(".title").click(function(){
	var victims=$(this).parent().find("li").not(".title");
	$(victims).slideToggle(100);
});

//stormies link
$("#gostormies").click(function(){
	window.open("http://stormies.dk");
});

$("#globalBtn").click(function(){
	//take me to global
});

$("#conversations>li:not(.title)").click(function(){
	//open this conversation
});

$("#onlineusers>li:not(.title)").click(function(){
	//contact this gay
});

$("#disconnectBtn").click(function(){
	//fuck off
});