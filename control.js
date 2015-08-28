var people_counter = require("./pc.js");
var dbMgr = require("./dbmanager.js");
var sensorchart = require("./sensorchart.js");
var intervalTime = 0;

var gpioPin1 = 16; // #23
var gpioPin2 = 18; // #24

exports.run = function () {
	// initialize DB manager
	dbMgr.setTable('adsl1');

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
}

function readSignalsInfinite() {
	setInterval(function() {
		var ports = [gpioPin1, gpioPin2];
		//console.log('try to read sensor values...');
		for (var i = 0; i < ports.length; i++) {
			//console.log('try to read value at ' + ports[i]);
			people_counter.readValuesAsync(ports[i], function (timestamp, value) {
				dbMgr.save(timestamp, value);
				transmit(timestamp, value); // XXX:add for sensor chart testing
			});
		}
	}
	, intervalTime);
}

var observations = [];
function transmit(timestamp, value) {

	var obs = {
		"datePublished": timestamp,
		"value" : value
	}
	observations.push(obs);
  var id = 'webofthink';
	var password = '';

	sensorchart.login(id, password, function (transmitter) {
	    if (transmitter) {
				var sensorUid = 22; // people counter
	        transmitter.emit(sensorId, observations, function (result) {
	            if (result == false) {
	                console.log('failed to transmit observations.');
	            } else {
								observations = []; // reset 
							}
	        });
	    } else {
	        console.log('login error!');
	    }
	});
}
