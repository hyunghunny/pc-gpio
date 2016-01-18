var people_counter = require("./pc.js");
var dbMgr = require("./dbmanager.js");
var sensorchart = require("./sensorchart.js");
var intervalTime = 0;

var gpioPin1 = 16; // #23
var gpioPin2 = 18; // #24

var id = 'webofthink';
var password = '';
var transmitter = null;
exports.run = function () {
	// initialize DB manager
	dbMgr.setTable('adsl1');

	//people_counter.cleanup(gpioPin1, gpioPin2); // release ports if it was used.

	people_counter.initialize(gpioPin1, gpioPin2,
		function() {
			console.log('ready to read sensors');
			readSignalsInfinite();
		},
		function () {
			console.log('failed to initialized');
			people_counter.cleanup(gpioPin1, gpioPin2);
			// terminate process with error condition
			process.exit(1);

	});
};

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

	}, intervalTime);
}

// try to keep connecting
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
	sensorchart.login(id, password, function (obj) {
		console.log('success to login');
		transmitter = obj;
	});
}, 60000);

var observations = [];
function transmit(timestamp, value) {

	var obs = {
		"datePublished": timestamp,
		"value" : value
	};
	observations.push(obs);

  if (transmitter) {
		var sensorId = 22; // people counter
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
}
