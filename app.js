var people_counter = require("./pc.js");


var gpioPin1 = 16; // #23
var gpioPin2 = 18; // #24

var intervalTime = 0;

people_counter.cleanup(gpioPin1, gpioPin2); // release ports if it was used.

// XXX: this code is not working properly.
process.on('exit', function (code) {
	// close ports when it exits
	people_counter.cleanup(gpioPin1, gpioPin2);
});

people_counter.initialize(gpioPin1, gpioPin2, function() {
		console.log('ready to read sensors');
		readSignalsInfinite();
	},
	function () {
		console.log('failed to initialized');
});


function readSignalsInfinite() {
	setInterval(function() {
		var ports = [gpioPin1, gpioPin2];
		//console.log('try to read sensor values...');
		for (var i = 0; i < ports.length; i++) {
			//console.log('try to read value at ' + ports[i]);
			people_counter.readValuesAsync(ports[i]);
		}
	}
	, intervalTime);
}
