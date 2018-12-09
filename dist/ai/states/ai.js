"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MIN_DISTANCE = 75;
var OK_DISTANCE = 100;
var EXECUTE_TIME_SEC = 60;
var CHECK_TIME_MS = 59000;
// Speeds must be between -100 and 100
var TURN_SPEED = 30;
var TURN_SPEED_OPPOSITE = -10;
var DRIVE_SPEED = 30;
var REVERSE_SPEED = -15;
function seek() {
    if (!this.control.driveInput || Date.now() - this.control.driveInput > CHECK_TIME_MS) {
        this.control.driveInput = Date.now();
        this.hub.motorTimeMulti(EXECUTE_TIME_SEC, TURN_SPEED, TURN_SPEED_OPPOSITE);
    }
    if (Date.now() - this.control.driveInput < 250)
        return;
    if (this.device.distance > this.prevDevice.distance) {
        this.control.turnDirection = 'right';
        this.setNextState('Turn');
    }
    else {
        this.control.turnDirection = 'left';
        this.setNextState('Turn');
    }
}
exports.seek = seek;
function turn() {
    if (this.device.distance < MIN_DISTANCE) {
        this.control.turnDirection = null;
        this.setNextState('Back');
        return;
    }
    else if (this.device.distance > OK_DISTANCE) {
        this.control.turnDirection = null;
        this.setNextState('Drive');
        return;
    }
    if (!this.control.driveInput || Date.now() - this.control.driveInput > CHECK_TIME_MS) {
        var motorA = this.control.turnDirection == 'right' ? TURN_SPEED : TURN_SPEED_OPPOSITE;
        var motorB = this.control.turnDirection == 'right' ? TURN_SPEED_OPPOSITE : TURN_SPEED;
        this.control.driveInput = Date.now();
        this.hub.motorTimeMulti(EXECUTE_TIME_SEC, motorA, motorB);
    }
}
exports.turn = turn;
function drive() {
    if (this.device.distance < MIN_DISTANCE) {
        this.setNextState('Back');
        return;
    }
    else if (this.device.distance < OK_DISTANCE) {
        this.setNextState('Seek');
        return;
    }
    if (!this.control.driveInput || Date.now() - this.control.driveInput > CHECK_TIME_MS) {
        this.control.driveInput = Date.now();
        this.hub.motorTimeMulti(EXECUTE_TIME_SEC, DRIVE_SPEED, DRIVE_SPEED);
    }
}
exports.drive = drive;
function back() {
    if (this.device.distance > OK_DISTANCE) {
        this.setNextState('Seek');
        return;
    }
    if (!this.control.driveInput || Date.now() - this.control.driveInput > CHECK_TIME_MS) {
        this.control.driveInput = Date.now();
        this.hub.motorTimeMulti(EXECUTE_TIME_SEC, REVERSE_SPEED, REVERSE_SPEED);
    }
}
exports.back = back;
function stop() {
    this.control.speed = 0;
    this.control.turnAngle = 0;
    if (!this.control.driveInput || Date.now() - this.control.driveInput > CHECK_TIME_MS) {
        this.control.driveInput = Date.now();
        this.hub.motorTimeMulti(EXECUTE_TIME_SEC, 0, 0);
    }
}
exports.stop = stop;
//# sourceMappingURL=ai.js.map