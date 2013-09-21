//globals
var username="costel";
var myavatar="http://2.bp.blogspot.com/-oSS6GN2Njpo/UWwqlRbmLqI/AAAAAAAAF3s/kKcMn6CuTps/s00/Emma-Watson-3.jpg";
var conversations=[];

var Message=function(){
	this.direction=0; //1 to, -1 from
	this.text=null;
}
var Conversation=function(){
	this.companion=null;
	this.messages=new Array();
}
//external users
var User=function(){
	this.username=null;
	this.avatar=null;
}

$(function(){

	var user=new User();
	user.username="cacacel";
	user.avatar="https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/10438_219232104870483_1529594262_n.jpg";

	/* from */
	var message=new Message();
	message.direction=-1;
	message.text="salut costele";

	var conversation=new Conversation();
	conversation.companion=user;
	conversation.messages.push(message);

	/* to */
	var message=new Message();
	message.direction=1;
	message.text="salut cacacel";

	conversation.messages.push(message);

	redrawConversation(conversation);

	/*
	drawSentMessage("ce faci scumpule?  <small style='color:#aaa'>12:92</small>");
	drawReceivedMessage("fanel", "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/10438_219232104870483_1529594262_n.jpg", "mulg o capra");
	drawSentMessage("si ea ce parere are?");
	drawReceivedMessage("fanel", "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/10438_219232104870483_1529594262_n.jpg", "cred ca-i place :)");
	*/
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
	drawSentMessage(text);
	if(toScrollOrNotToScroll) scrollToBottom();
	//redrawConversation();
});

function redrawConversation(conversation){
	var companion=conversation.companion;
	var messages=conversation.messages;
	$(messages).each(function(){
		if(this.direction<0){
			drawReceivedMessage(companion.username, companion.avatar, this.text);
		} else if(this.direction>0){
			drawSentMessage(this.text);
		} else {
			console.log("Unknown direction: this should not happen!");
		}
	});
}

//chat functionality
function drawSentMessage(message){
	var dom=$(".template.chat_out").clone().removeClass("template chat_out");
	dom.find(".avatar span").text(username);
	dom.find(".avatar img").prop("src", myavatar);
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