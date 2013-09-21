/* CONSTANTS */
var SERVER_HOST="192.168.1.110";
var SERVER_PORT=3333;

/* IMPORTS */
var printf = require('util').format;
var net = require('net');

/* GLOBALS */
var username=process.argv.splice(2);

/* SERVER-CLIENT SOCKET HYBRID */
var socket = null;
socket= new net.createConnection(SERVER_PORT, SERVER_HOST);
socket.on('connect', function(){
    console.log("Server socket opened.");
    clientConnect(username);
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

/* CLIENT UTILITIES */
function clientConnect(username){
    console.log(username);
    console.log(printf("Connecting as '%s'.", username));
    socket.write("CONNECT#"+username+"\n");
    sendMessage("*", "test");
}
function disconnect(){
    console.log("Disconnecting.");
    socket.write("CLOSE\n");
}
function sendMessage(to, message){
    console.log(printf("Sending message '%s' to [%s]", message, to));
    socket.write(printf("SEND#%s#%s\n", to, message));
}
function parseRequest(message){
	message+="";
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
    		break;
    	case "MESSAGE":
    		var from=args[0];
    		var message=args[1];
    		//do something
    		break;
    	case "CLOSE":
            console.log("Disconnecting from server.");
    		process.exit();
    		break;
    	default:
    		break;
    }
}
