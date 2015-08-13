var gpio = require("pi-gpio");

var intervalId = 0;
var durationId = 0;

var gpioPin1 = 16; // #23
var gpioPin2 = 18; // #24

var intervalTime = 0;

cleanup(); // release ports if it was used.

// XXX: this code is not working properly.
process.on('exit', function (code) {
	// close ports when it exits
	cleanup();
});

function cleanup () {
	gpio.close(gpioPin1);
	gpio.close(gpioPin2);

};

function initialize(scb, ecb)  {
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
var gpioPin1Value = 1; // no blocking as default;
var gpioPin2Value = 1; // no blocking as default;

var observations = [];

initialize(function() {
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
			function readPortAsync(port) {
				//console.log('reading at ' + port);
				readPort(port, function (value) {
						var obs = { "pin" : port , "value" : value };
						//console.log(JSON.stringify(obs));
						observations.push(obs);
						if(observations.length == 2) {
							/*
							console.log(JSON.stringify(observations[0]) + ":" + 
								JSON.stringify(observations[1]));
							*/
							var sensor1 = observations[0].value;
							var sensor2 =  observations[1].value;
							var d = new Date();							
							if (sensor1 > sensor2) {
								console.log(d.toLocaleTimeString() + ' : pattern A');
							}  else if (sensor1 < sensor2) {
								console.log(d.toLocaleTimeString() + ' : pattern B');
							}  else if ( sensor1 == 0 && sensor2 == 0) {
								console.log(d.toLocaleTimeString() + ' : pattern C');
							} else {
								// skip if two sensor value is same 1
							}

							observations = []; // reset
						}
					},
					function() {
						console.log('error on reading ' + port);
				});
			}
			readPortAsync(ports[i]);
		
		}
	}

	, intervalTime);
}

function readPort(gpioPin, scb, ecb) {
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

