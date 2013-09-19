//globals
var username="seniorita";

$(function(){
	drawSentMessage("ce faci scumpule?  <small style='color:#aaa'>12:92</small>");
	drawReceivedMessage("fanel", "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/10438_219232104870483_1529594262_n.jpg", "mulg o capra");
	drawSentMessage("si ea ce parere are?");
	drawReceivedMessage("fanel", "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/10438_219232104870483_1529594262_n.jpg", "cred ca-i place :)");
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

$("#sendBtn").click(function(){
	var text=$("#input").val();
	//send the shit
	//display the shit
	var a=$('#scene').scrollTop()+$("#scene").height()+40;
	var b=$('#scene')[0].scrollHeight;
	var toScrollOrNotToScroll=(a==b?true:false);
	if(toScrollOrNotToScroll) scrollToBottom();
	drawSentMessage(text);
	//redrawConversation();
});

function redrawConversation(){
	//drawSentMessage(text);
}

//chat functionality
function drawSentMessage(message){
	var dom=$(".template.chat_out").clone().removeClass("template chat_out");
	dom.find(".avatar span").text(username);
	dom.find(".content .text").html(message);
	dom.appendTo($("#chat"));
}
function drawReceivedMessage(from, avatar, message){
	var dom=$(".template.chat_in").clone().removeClass("template chat_out");
	dom.find(".avatar span").text(from);
	dom.find(".avatar img").prop("src", avatar);
	dom.find(".content .text").text(message);
	dom.appendTo($("#chat"));
}

function scrollToBottom(){
	var wtf    = $('#scene');
	var height = wtf[0].scrollHeight;
	wtf.scrollTop(height);
}