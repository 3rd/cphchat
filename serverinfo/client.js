/* IMPORTS */
var dgram = require('dgram');
var _ = require('underscore');
var printf = require('util').format;

/* CONSTANTS */
var HOST=_.chain(require('os').networkInterfaces()).flatten().filter(function(val){ return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var SERVER_HOST="192.168.1.110";
var SERVER_PORT=44444;

/* SERVER-CLIENT SOCKET HYBRID */
var server = dgram.createSocket('udp4');
server.on('listening', function(){
	var address = server.address();
    console.log(printf("Socket opened on %s:%s", address.address, address.port));
    serverSend("give me some stats");
});
server.on('message', function(message, remote){
	console.log(message+"");
});
server.bind(0, HOST);

/* CLIENT UTILITIES */
function serverSend(message){
	message = new Buffer(message);
	server.send(message, 0, message.length, SERVER_PORT, SERVER_HOST, function(err, bytes) {
	    if (err) throw err;
	});
}