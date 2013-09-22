//globals
var _username="costel";
var _myavatar="assets/avatar1.jpg";
var _conversations=[];
var _currentCompanion=null;

var Message=function(){
	this.direction=0; //1 to, -1 from
	this.text=null;
}
var Conversation=function(companion){
	this.companion=(typeof companion=="undefined"?null:companion);
	this.messages=new Array();
}
//external users
var User=function(){
	this.username=null;
	this.avatar=null;
}

$(function(){
	var host=prompt("Server IP:","");
	var port=prompt("Server PORT:", "");
	var username=prompt("Username:", "");
	if(host==null || host=="" || port==null || host=="" || username==null || username == "") {
		alert("Next time use valid values!");
		process.exit();
	}
	_username=username;
	connectToServer(host, port);
	$("#sendBtn").addClass("disabled");
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

$(document).on("click", "#conversations li", function(){
	var username=$(this).find("span").text();
	if(!$(this).hasClass("title") && typeof _conversations[username] != "undefined"){
		_currentCompanion=username;
		redrawConversation(_conversations[_currentCompanion]);
	}
});

$("#input").keyup(function(event){
    if(event.keyCode == 13){
        $("#sendBtn").trigger("click");
    }
});

$(document).on("click", "#onlineusers li", function(){
	var username=$(this).text();
	if($(this).hasClass("title")) return;
	if(typeof _conversations[username] == "undefined"){
		_currentCompanion=username;
		var targetConversation=new Conversation(_currentCompanion);
        var _user=new User();
        _user.username=_currentCompanion;
        _user.avatar="assets/avatar2.png";
        targetConversation.companion=_user;
        _conversations[_currentCompanion]=targetConversation;
		redrawConversation(_conversations[_currentCompanion]);
		redrawConversationList();
	} else {
		_currentCompanion=username;
		redrawConversation(_conversations[_currentCompanion]);
	}
});

$("#disconnectBtn").click(function(){
	disconnect();
});

$("#sendBtn").click(function(){
	if(!$(this).hasClass("disabled")){
		var text=$("#input").val();
		if($("#chat").is(":visible")){
			//send the shit
			//display the shit
			
			//drawSentMessage(text);
			sendCurrentMessage(text);
		} else {
			var log=$("<p/>");
		    log.text(" CLIENT REQUEST: "+text+"\n");
		    log.appendTo($("#console"));
			window.socket.write(text+"\n");
		}
		$("#input").val("");
	}
});

function scrollTheThing(){
	var a=$('#scene').scrollTop()+$("#scene").height()+40;
	var b=$('#scene')[0].scrollHeight;
	var toScrollOrNotToScroll=(a==b?true:false);
	return toScrollOrNotToScroll;
}

$("#consoleBtn").click(function(){
	if(!$("#console").is(":visible")) $("#sendBtn").removeClass("disabled");
	else { clearConversation(); $("#sendBtn").addClass("disabled"); }
	$("#chat").slideToggle();
	$("#console").slideToggle();
});

function sendCurrentMessage(text){
	var message=new Message();
	message.direction=1;
	message.text=text;
	sendMessage(_currentCompanion, text);
	_conversations[_currentCompanion].messages.push(message);
	redrawConversation(_conversations[_currentCompanion]);
}

function clearConversation(){
	$("#chat").html('');
}
function redrawConversation(conversation){
	var scroll=scrollTheThing();
	$("#chat").html('');
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
	$("#sendBtn").removeClass("disabled");
	if(scroll) scrollToBottom();
}
function redrawConversationList(){
	$("#conversations li").not(".title").remove();
	for(var k in _conversations){
		var big=$("<li/>");
		var element=$("<span/>");
		element.text(k);
		var closeme=$("<div class='close'>x</div>");
		element.appendTo(big);
		closeme.appendTo(big);
		closeme.click(function(){
			delete _conversations[k];
			redrawConversationList();
			if(_currentCompanion==k) clearConversation();
			if(!$("#console").is(":visible")) $("#sendBtn").addClass("disabled");
		});
		$(big).appendTo($("#conversations")).slideToggle();
	}
}

//chat functionality
function drawSentMessage(message){
	var dom=$(".template.chat_out").clone().removeClass("template chat_out");
	dom.find(".avatar span").text(_username);
	dom.find(".avatar img").prop("src", _myavatar);
	dom.find(".content .text").text(message);
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