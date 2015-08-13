// clean up
var gpio = require("pi-gpio");
var gpioPin1 = 16;
var gpioPin2 = 18;

gpio.close(gpioPin1);
gpio.close(gpioPin2);
