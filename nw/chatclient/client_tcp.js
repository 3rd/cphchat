/* IMPORTS */
var printf = require('util').format;
var net = require('net');
var _ = require('underscore');

/* GLOBALS */

/* SERVER-CLIENT SOCKET HYBRID */
function connectToServer(arghost, argport){
    window.socket = null;
    socket= new net.createConnection(argport, arghost);
    socket.on('connect', function(){
        console.log("Server socket opened.");
        clientConnect(_username);
    });
    socket.on('data', function(data){
        (data+"").split('\n').forEach(function(data){
            if(data.length>0){
                console.log("Server response: "+data);
                parseRequest(data);
            }
        });
    });
    socket.on('error', function(error){
        console.log(error);
    });
}

/* CLIENT UTILITIES */
function clientConnect(username){
    console.log(username);
    console.log(printf("Connecting as '%s'.", username));
    var log=$("<p/>");
    log.text(" CLIENT REQUEST: "+"CONNECT#"+username+"\n");
    log.appendTo($("#console"));
    socket.write("CONNECT#"+username+"\n");
}
function disconnect(){
    console.log("Disconnecting.");
    var log=$("<p/>");
    log.text(" CLIENT REQUEST: "+"CLOSE#\n");
    log.appendTo($("#console"));
    socket.write("CLOSE#\n");
}
function sendMessage(to, message){
    console.log(printf("Sending message '%s' to [%s]", message, to));
    var log=$("<p/>");
    log.text(" CLIENT REQUEST: "+printf("SEND#%s#%s\n", to, message));
    log.appendTo($("#console"));
    socket.write(printf("SEND#%s#%s\n", to, message));
}
function parseRequest(message){
	message+="";
    var log=$("<p/>");
    log.text(" SERVER RESPONSE: "+message);
    log.appendTo($("#console"));
	var aux=message.split("#");
    var cmd=aux[0];
    var args=[];
    for(var i=1; i<aux.length; i++){
    	args.push(aux[i]);
    }
    switch(cmd){
    	case "ONLINE":
    		var users=args[0].split(",");
    		//do something
            $("#onlineusers li").not(".title").remove();
            _.each(users, function(user){
                var element=$("<li/>");
                element.text(user);
                $(element).appendTo($("#onlineusers")).slideToggle();
            });
    		break;
    	case "MESSAGE":
    		var from=args[0];
    		var message=args[1];
    		//do something
            var targetConversation=null;
            var redrawlist=false;
            if(typeof _conversations[from] == "undefined"){
                targetConversation=new Conversation(from);
                var _user=new User();
                _user.username=from;
                _user.avatar="assets/avatar2.png";
                targetConversation.companion=_user;
                console.log(targetConversation);
                _conversations[from]=targetConversation;
                _currentCompanion=from;
                redrawlist=true;
            }
            targetConversation=_conversations[from];
            var _message=new Message();
            _message.direction=-1;
            _message.text=message;
            targetConversation.messages.push(_message);
            if(_currentCompanion==from) redrawConversation(targetConversation);
            if(redrawlist) redrawConversationList();
    		break;
    	case "CLOSE":
            console.log("Disconnecting from server.");
    		process.exit();
    		break;
    	default:
    		break;
    }
}
