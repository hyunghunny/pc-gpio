var gpio = require("pi-gpio");

var intervalId = 0;
var durationId = 0;

var gpioPin = 11;

gpio.open(gpioPin, 'output', function(err) {

	var on = 1;
	console.log('GPIO pin ' + gpioPin + ' is open, toggle LED every 100ms for 10 secs');

	intervalId = setInterval( function () {
		console.log('write ' + on + ' to pin ' + gpioPin);

		gpio.write(gpioPin, on, function () {
			on = (on + 1) % 2;
		});

	}, 100);

	durationId = setTimeout(function () {
		clearInterval(intervalId);
		clearTimeout(durationId);
		console.log('10 secs blinking completed');
		gpio.write(gpioPin, 0, function() {
			gpio.close(gpioPin);
			process.exit(0);
		});
	}, 10000);
});
