var gpio = require("pi-gpio");

var intervalId = 0;
var durationId = 0;

var intervalTime = 0;

exports.initialize = function (gpioPin1, gpioPin2, scb, ecb)  {
	gpio.open(gpioPin1, 'input', function(err) {
		if (err) {
			console.log(gpioPin1 + ' port open error: ' + err);
			ecb();
		} else {
			gpio.open(gpioPin2, 'input', function(err) {
				if (err) {
					console.log(gpioPin2 + ' port open error: ' + err);
					ecb();
				} else {
					scb();
				}
			});

		}
	});
}

exports.cleanup = function (gpioPin1, gpioPin2) {
	gpio.close(gpioPin1);
	gpio.close(gpioPin2);
};


function getValue(gpioPin, scb, ecb) {
	gpio.read(gpioPin, function(err, value) {
		if (err) {
			console.log('read error: ' + err);
			ecb();

		} else {
			//console.log(gpioPin + ' returns ' + value);  // 0 means blocks, 1 means no blocks
			scb(value);
		}
	});
}

var observation = []; // for containing sensing observations at the same time

exports.readValuesAsync = function (port) {
	//console.log('reading at ' + port);
	getValue(port, function (value) {
			var obs = { "pin" : port , "value" : value };
			//console.log(JSON.stringify(obs));
			observation.push(obs);
			if(pass.length == 2) {
				/*
				console.log(JSON.stringify(observations[0]) + ":" +
					JSON.stringify(observations[1]));
				*/
				var sensor1 = observation[0].value;
				var sensor2 =  observation[1].value;
				var d = new Date();
				if (sensor1 === 1 && sensor2 === 0) {
					console.log(d.toLocaleTimeString() + ' : pattern A');
				}  else if (sensor1 === 0 && sensor2 === 1) {
					console.log(d.toLocaleTimeString() + ' : pattern B');
				}  else if ( sensor1 === 0 && sensor2 === 0) {
					console.log(d.toLocaleTimeString() + ' : pattern C');
				} else {
					// skip if two sensor value is same as 1
				}
				observation = []; // reset
			}
		},
		function() {
			console.log('error on reading ' + port);
	});
}
