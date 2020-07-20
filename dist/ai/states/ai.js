"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seek = exports.turn = exports.drive = exports.back = exports.stop = void 0;
var MIN_DISTANCE = 75;
var OK_DISTANCE = 100;
var EXECUTE_TIME_SEC = 60;
var CHECK_TIME_MS = 59000;
// Speeds must be between -100 and 100
var TURN_SPEED = 30;
var TURN_SPEED_OPPOSITE = -10;
var DRIVE_SPEED = 30;
var REVERSE_SPEED = -15;
var seek = function (hubControl) {
    if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
        hubControl.control.controlUpdateTime = Date.now();
        hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, TURN_SPEED, TURN_SPEED_OPPOSITE);
    }
    if (Date.now() - hubControl.control.controlUpdateTime < 250)
        return;
    if (hubControl.device.distance > hubControl.prevDevice.distance) {
        hubControl.control.turnDirection = 'right';
        hubControl.setNextState('Turn');
    }
    else {
        hubControl.control.turnDirection = 'left';
        hubControl.setNextState('Turn');
    }
};
exports.seek = seek;
var turn = function (hubControl) {
    if (hubControl.device.distance < MIN_DISTANCE) {
        hubControl.control.turnDirection = null;
        hubControl.setNextState('Back');
        return;
    }
    else if (hubControl.device.distance > OK_DISTANCE) {
        hubControl.control.turnDirection = null;
        hubControl.setNextState('Drive');
        return;
    }
    if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
        var motorA = hubControl.control.turnDirection === 'right' ? TURN_SPEED : TURN_SPEED_OPPOSITE;
        var motorB = hubControl.control.turnDirection === 'right' ? TURN_SPEED_OPPOSITE : TURN_SPEED;
        hubControl.control.controlUpdateTime = Date.now();
        hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, motorA, motorB);
    }
};
exports.turn = turn;
var drive = function (hubControl) {
    if (hubControl.device.distance < MIN_DISTANCE) {
        hubControl.setNextState('Back');
        return;
    }
    else if (hubControl.device.distance < OK_DISTANCE) {
        hubControl.setNextState('Seek');
        return;
    }
    if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
        hubControl.control.controlUpdateTime = Date.now();
        var speed = hubControl.configuration.leftMotor === 'A' ? DRIVE_SPEED : DRIVE_SPEED * -1;
        hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, speed, speed);
    }
};
exports.drive = drive;
var back = function (hubControl) {
    if (hubControl.device.distance > OK_DISTANCE) {
        hubControl.setNextState('Seek');
        return;
    }
    if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
        hubControl.control.controlUpdateTime = Date.now();
        var speed = hubControl.configuration.leftMotor === 'A' ? REVERSE_SPEED : REVERSE_SPEED * -1;
        hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, speed, speed);
    }
};
exports.back = back;
var stop = function (hubControl) {
    hubControl.control.speed = 0;
    hubControl.control.turnAngle = 0;
    if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
        hubControl.control.controlUpdateTime = Date.now();
        hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, 0, 0);
    }
};
exports.stop = stop;
//# sourceMappingURL=ai.js.map