/* IMPORTS */
var dgram = require('dgram');
var _ = require('underscore');
var printf = require('util').format;
var net = require('net');

/* CONSTANTS */
var HOST=_.chain(require('os').networkInterfaces()).flatten().filter(function(val){ return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var PORT=3333;
console.log("Starting TCP server on "+HOST+":"+PORT);

/* CLASSES */
function User(ip, port, username, socket){
	this.ip=ip;
	this.port=port;
	this.username=username;
	this.socket=socket;
	this.send=function(message){
		try {
			this.socket.write(message+"\n");
		} catch(e){
			console.log("Cannot write to socket.");
		}
	}
}
function UserList(){
	this.users=[];
	this.addUser=function(user){
		this.users.push(user);
	};
	this.getUser=function(username){
		_.each(this.users, function(user){
			if(this.username==username){
				return user;
			}
		});
	};
	this.getUserByIPAndPort=function(ip, port){
		var result=null;
		_.each(this.users, function(user){
			if(user.ip==ip && user.port==port){
				result=user;
			}
		});
		return result;
	};
	this.getUserBySocket=function(socket){
		var result=null;
		_.each(this.users, function(user){
			if(user.socket===socket){
				result=user;
			}
		});
		return result;
	};
	this.removeBySocket=function(socket){
		this.users=_(this.users).reject(function(user) {
			if(user.socket===socket){
				try {
					user.socket.write("CLOSE#");
					user.socket.end();
				} catch(e) {
					console.log("Socket has been already closed by remote party.");
				}
			}
			return user.socket === socket; 
		});
	};
	this.removeByIP=function(ip){
		this.users=_(this.users).reject(function(user) {
			user.socket.write("CLOSE#");
			user.socket.end();
			return user.ip == ip; 
		});
	}
	this.removeByIPAndPort=function(ip, port){
		this.users=_(this.users).reject(function(user) {
			try {
				user.socket.write("CLOSE#");
				user.socket.end();
			} catch(e) {
				console.log("Socket has been already closed by remote party.");
			}
			finally {
				return (user.ip == ip && user.port == port); 
			}
		});
	}
	this.getUsers=function(){
		return this.users;
	}
	this.sendMessage=function(senderip, senderport, users, message){
		var sender=this.getUserBySocket(socket);
		var _this=this;
		if(sender!=null){
			_.each(users, function(requestedUser){
				_.each(_this.users, function(user){
					if(requestedUser==user.username){
						user.send("MESSAGE#"+sender.username+"#"+message);
					}
				});
			});
		}
	}
}

/* GLOBALS */
var connectedUsers=new UserList();

/* SERVER CREATION, EVENTING AND STARTING */
net.createServer(function (socket) {
	var ip = socket.remoteAddress;
	var port= socket.remotePort;
	console.log(printf("Incoming socket from %s:%s.",ip, port));
	socket.on('data', function(data){
		(data+"").split('\n').forEach(function(data){
			if(data.length>0){
				console.log(printf("Data coming from %s:%s -> %s", ip, port, data));
				parseRequest({address:ip, port:port}, data, socket);
			}
		});
	});
	socket.on('close', function(){
		//according to the class this should not happen
		//"better be safe than sorry" - Durex
		connectedUsers.removeBySocket(socket);
		propagateOnlineUsers();
	});
}).listen(PORT, HOST);

/* REQUEST PARSING */
function parseRequest(remote, message, socket){
	message+="";
	var aux=message.split("#");
    var cmd=aux[0];
    var args=[];
    for(var i=1; i<aux.length; i++){
    	args.push(aux[i]);
    }
    switch(cmd){
    	case "CONNECT":
    		var username=args[0];
    		var ip=remote.address;
    		var port=remote.port;
    		console.log("Incoming port:"+port);
    		connectedUsers.addUser(new User(ip, port, username, socket));
    		propagateOnlineUsers();
    		break;
    	case "SEND":
    		var to=args[0];
    		var message=args[1];
    		if(typeof to !="undefined" && typeof message!="undefined"){
	    		if(to!="*"){
	    			to=to.split(",");
	    			connectedUsers.sendMessage(remote.address, remote.port , to, message);
	    		} else {
	    			var sender=connectedUsers.getUserBySocket(socket);
	    			_.each(connectedUsers.users, function(user){
						user.send("MESSAGE#"+sender.username+"#"+message);
					});
	    		}
    		}
    		break;
    	case "CLOSE":
    		var ip=remote.address;
    		connectedUsers.removeBySocket(socket);
    		propagateOnlineUsers();
    		break;
    	default:
    		break;
    }
}

/* CHAT UTILITIES */
function propagateOnlineUsers(){
	var response="ONLINE#";
	var users=connectedUsers.getUsers();
	if(users.length>0){
		_.each(users, function(user){
			response+=user.username+",";
		});
		response=response.substring(0, response.length - 1);
	}
	_.each(users, function(user){
		user.send(response);
	});
}