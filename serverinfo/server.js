/* IMPORTS */
var dgram = require('dgram');
var _ = require('underscore');
var printf = require('util').format;
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

/* CONSTANTS */
var HOST=_.chain(require('os').networkInterfaces()).flatten().filter(function(val){ return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var PORT=44444;

/* SERVER CREATION, EVENTING AND STARTING */
var server = dgram.createSocket('udp4');
server.on('listening', function(){
	var address = server.address();
    console.log(printf("Server started on %s:%s", address.address, address.port));
});
server.on('message', function(message, remote){
	getInfo(remote, sendData);
});
server.bind(PORT, HOST);

function sendData(remote, o){
	var servertime="Server time: "+getServerTime();
	var memory="Used memory: " + getMemory();
	var cpuload="CPU Load: "+getCPULoad();
	var freememory="Available memory: "+getAvailableMemory();
	var runningprocesses="Running processes: "+o;

	var data=printf("%s\n%s\n%s\n%s\n%s\n", servertime, memory, cpuload, freememory, runningprocesses);

	data = new Buffer(data);
	server.send(data, 0, data.length, remote.port, remote.address, function(err, bytes) {
	    if (err) throw err;
	});
}
function getServerTime(){
	var currentdate = new Date(); 
	var datetime =  currentdate.getDate() + "/"
	+ (currentdate.getMonth()+1)  + "/" 
	+ currentdate.getFullYear() + " @ "  
	+ currentdate.getHours() + ":"  
	+ currentdate.getMinutes() + ":" 
	+ currentdate.getSeconds();
	return datetime;
}
function getMemory(){
	return os.totalmem()+"/"+os.freemem();
}
function getAvailableMemory() {
	return os.freemem();
}
function getCPULoad(){
	return os.loadavg()[0];
}
function getInfo(remote, callback){
	var val=null;
	child =exec('ps ax | wc -l | sed -e "s: ::g"', function(e,o,r){
		callback(remote, o);
	});
}