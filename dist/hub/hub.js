"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eventEmitter_1 = require("../helpers/eventEmitter");
var buffer_1 = require("../helpers/buffer");
var Hub = /** @class */ (function () {
    function Hub(characteristic) {
        var _this = this;
        this.emitter = new eventEmitter_1.EventEmitter();
        this.autoSubscribe = true;
        this.writeCue = [];
        this.isWritting = false;
        this.characteristic = characteristic;
        this.log = console.log;
        this.autoSubscribe = true;
        this.ports = {};
        this.num2type = {
            23: 'LED',
            37: 'DISTANCE',
            38: 'IMOTOR',
            39: 'MOTOR',
            40: 'TILT',
        };
        this.port2num = {
            C: 0x01,
            D: 0x02,
            LED: 0x32,
            A: 0x37,
            B: 0x38,
            AB: 0x39,
            TILT: 0x3a,
        };
        this.num2port = {};
        Object.keys(this.port2num).forEach(function (p) {
            _this.num2port[_this.port2num[p]] = p;
        });
        this.num2action = {
            1: 'start',
            5: 'conflict',
            10: 'stop',
        };
        this.num2color = {
            0: 'black',
            3: 'blue',
            5: 'green',
            7: 'yellow',
            9: 'red',
            10: 'white',
        };
        this.addListeners();
    }
    Hub.prototype.emit = function (type, data) {
        if (data === void 0) { data = null; }
        this.emitter.emit(type, data);
    };
    Hub.prototype.addListeners = function () {
        var _this = this;
        this.characteristic.addEventListener('gattserverdisconnected', function (event) {
            // @ts-ignore
            _this.log("Device " + event.target.name + " is disconnected.");
            if (_this.noReconnect === false)
                _this.emit('disconnected');
        });
        this.characteristic.addEventListener('characteristicvaluechanged', function (event) {
            // https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
            // @ts-ignore
            var data = buffer_1.Buffer.from(event.target.value.buffer);
            _this.parseMessage(data);
        });
        setTimeout(function () {
            // Without timout missed first characteristicvaluechanged events
            _this.characteristic.startNotifications();
        }, 1000);
    };
    Hub.prototype.parseMessage = function (data) {
        var _this = this;
        switch (data[2]) {
            case 0x04: {
                clearTimeout(this.portInfoTimeout);
                this.portInfoTimeout = setTimeout(function () {
                    /**
                     * Fires when a connection to the Move Hub is established
                     * @event Hub#connect
                     */
                    if (_this.autoSubscribe) {
                        _this.subscribeAll();
                    }
                    _this.connected = true;
                    _this.emit('connect');
                }, 1000);
                console.log('Found: ' + this.num2type[data[5]]);
                if (data[4] === 0x01) {
                    this.ports[data[3]] = {
                        type: 'port',
                        deviceType: this.num2type[data[5]],
                        deviceTypeNum: data[5],
                    };
                }
                else if (data[4] === 0x02) {
                    this.ports[data[3]] = {
                        type: 'group',
                        deviceType: this.num2type[data[5]],
                        deviceTypeNum: data[5],
                        members: [data[7], data[8]],
                    };
                }
                break;
            }
            case 0x45: {
                this.parseSensor(data);
                break;
            }
            case 0x47: {
                // 0x47 subscription acknowledgements
                // https://github.com/JorgePe/BOOSTreveng/blob/master/Notifications.md
                break;
            }
            case 0x82: {
                /**
                 * Fires on port changes
                 * @event Hub#port
                 * @param port {object}
                 * @param port.port {string}
                 * @param port.action {string}
                 */
                this.emit('port', {
                    port: this.num2port[data[3]],
                    action: this.num2action[data[4]],
                });
                break;
            }
            default:
                this.log('unknown message type 0x' + data[2].toString(16));
                this.log('<', data);
        }
    };
    Hub.prototype.parseSensor = function (data) {
        if (!this.ports[data[3]]) {
            this.log('parseSensor unknown port 0x' + data[3].toString(16));
            return;
        }
        switch (this.ports[data[3]].deviceType) {
            case 'DISTANCE': {
                /**
                 * @event Hub#color
                 * @param color {string}
                 */
                this.emit('color', this.num2color[data[4]]);
                // TODO improve distance calculation!
                var distance = void 0;
                if (data[7] > 0 && data[5] < 2) {
                    distance = Math.floor(20 - data[7] * 2.85);
                }
                else if (data[5] > 9) {
                    distance = Infinity;
                }
                else {
                    distance = Math.floor(20 + data[5] * 18);
                }
                /**
                 * @event Hub#distance
                 * @param distance {number} distance in millimeters
                 */
                this.emit('distance', distance);
                break;
            }
            case 'TILT': {
                var roll = data.readInt8(4);
                var pitch = data.readInt8(5);
                /**
                 * @event Hub#tilt
                 * @param tilt {object}
                 * @param tilt.roll {number}
                 * @param tilt.pitch {number}
                 */
                this.emit('tilt', { roll: roll, pitch: pitch });
                break;
            }
            case 'MOTOR':
            case 'IMOTOR': {
                var angle = data.readInt32LE(4);
                /**
                 * @event Hub#rotation
                 * @param rotation {object}
                 * @param rotation.port {string}
                 * @param rotation.angle
                 */
                this.emit('rotation', {
                    port: this.num2port[data[3]],
                    angle: angle,
                });
                break;
            }
            default:
                this.log('unknown sensor type 0x' + data[3].toString(16), data[3], this.ports[data[3]].deviceType);
        }
    };
    /**
     * Disconnect from Move Hub
     * @method Hub#disconnect
     */
    Hub.prototype.disconnect = function () {
        if (this.connected) {
            //this.characteristic.disconnect();
            this.noReconnect = true;
        }
    };
    /**
     * Run a motor for specific time
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} seconds
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} [callback]
     */
    Hub.prototype.motorTime = function (port, seconds, dutyCycle, callback) {
        if (typeof dutyCycle === 'function') {
            callback = dutyCycle;
            dutyCycle = 100;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(this.encodeMotorTime(port, seconds, dutyCycle), callback);
    };
    /**
     * Run both motors (A and B) for specific time
     * @param {number} seconds
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} callback
     */
    Hub.prototype.motorTimeMulti = function (seconds, dutyCycleA, dutyCycleB, callback) {
        this.write(this.encodeMotorTimeMulti(0x39, seconds, dutyCycleA, dutyCycleB), callback);
    };
    /**
     * Turn a motor by specific angle
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} angle - degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} [callback]
     */
    Hub.prototype.motorAngle = function (port, angle, dutyCycle, callback) {
        if (typeof dutyCycle === 'function') {
            callback = dutyCycle;
            dutyCycle = 100;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(this.encodeMotorAngle(port, angle, dutyCycle), callback);
    };
    /**
     * Turn both motors (A and B) by specific angle
     * @param {number} angle degrees to turn from `0` to `2147483647`
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} callback
     */
    Hub.prototype.motorAngleMulti = function (angle, dutyCycleA, dutyCycleB, callback) {
        this.write(this.encodeMotorAngleMulti(0x39, angle, dutyCycleA, dutyCycleB), callback);
    };
    Hub.prototype.motorPowerCommand = function (port, power) {
        this.write(this.encodeMotorPower(port, power));
    };
    //[0x09, 0x00, 0x81, 0x39, 0x11, 0x07, 0x00, 0x64, 0x03]
    Hub.prototype.encodeMotorPower = function (port, dutyCycle) {
        if (dutyCycle === void 0) { dutyCycle = 100; }
        var p = this.port2num[port];
        // @ts-ignore
        var buf = buffer_1.Buffer.from([0x09, 0x00, 0x81, p, 0x11, 0x07, 0x00, 0x64, 0x03]);
        //buf.writeUInt16LE(seconds * 1000, 6);
        buf.writeInt8(dutyCycle, 6);
        return buf;
    };
    //0x0C, 0x00, 0x81, port, 0x11, 0x09, 0x00, 0x00, 0x00, 0x64, 0x7F, 0x03
    /**
     * Control the LED on the Move Hub
     * @method Hub#led
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @param {function} [callback]
     */
    Hub.prototype.led = function (color, callback) {
        this.write(this.encodeLed(color), callback);
    };
    /**
     * Subscribe for sensor notifications
     * @param {string|number} port - e.g. call `.subscribe('C')` if you have your distance/color sensor on port C.
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    Hub.prototype.subscribe = function (port, option, callback) {
        if (option === void 0) { option = 0; }
        if (typeof option === 'function') {
            callback = option;
            option = 0x00;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(
        // @ts-ignore
        buffer_1.Buffer.from([0x0a, 0x00, 0x41, port, option, 0x01, 0x00, 0x00, 0x00, 0x01]), callback);
    };
    /**
     * Unsubscribe from sensor notifications
     * @param {string|number} port
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    Hub.prototype.unsubscribe = function (port, option, callback) {
        if (option === void 0) { option = 0; }
        if (typeof option === 'function') {
            callback = option;
            option = 0x00;
        }
        if (typeof port === 'string') {
            port = this.port2num[port];
        }
        this.write(
        // @ts-ignore
        buffer_1.Buffer.from([0x0a, 0x00, 0x41, port, option, 0x01, 0x00, 0x00, 0x00, 0x00]), callback);
    };
    Hub.prototype.subscribeAll = function () {
        var _this = this;
        Object.keys(this.ports).forEach(function (port) {
            if (_this.ports[port].deviceType === 'DISTANCE') {
                _this.subscribe(parseInt(port, 10), 8);
            }
            else if (_this.ports[port].deviceType === 'TILT') {
                _this.subscribe(parseInt(port, 10), 0);
            }
            else if (_this.ports[port].deviceType === 'IMOTOR') {
                _this.subscribe(parseInt(port, 10), 2);
            }
            else if (_this.ports[port].deviceType === 'MOTOR') {
                _this.subscribe(parseInt(port, 10), 2);
            }
        });
    };
    /**
     * Send data over BLE
     * @method Hub#write
     * @param {string|Buffer} data If a string is given it has to have hex bytes separated by spaces, e.g. `0a 01 c3 b2`
     * @param {function} callback
     */
    Hub.prototype.write = function (data, callback) {
        if (typeof data === 'string') {
            var arr_1 = [];
            data.split(' ').forEach(function (c) {
                arr_1.push(parseInt(c, 16));
            });
            // @ts-ignore
            data = buffer_1.Buffer.from(arr_1);
        }
        // Original implementation passed secondArg to define if response is waited
        this.writeCue.push({
            data: data,
            secondArg: true,
            callback: callback,
        });
        this.writeFromCue();
    };
    Hub.prototype.writeFromCue = function () {
        var _this = this;
        if (this.writeCue.length > 0 && !this.isWritting) {
            var el_1 = this.writeCue.shift();
            this.isWritting = true;
            this.characteristic
                .writeValue(el_1.data)
                .then(function () {
                _this.isWritting = false;
                if (typeof el_1.callback === 'function')
                    el_1.callback();
                _this.writeFromCue();
            })
                .catch(function (err) {
                _this.log("Error while writing: " + el_1.data + " - Error " + err.toString());
                // TODO: Notify of failure
                _this.writeFromCue();
            });
        }
    };
    Hub.prototype.encodeMotorTimeMulti = function (port, seconds, dutyCycleA, dutyCycleB) {
        if (dutyCycleA === void 0) { dutyCycleA = 100; }
        if (dutyCycleB === void 0) { dutyCycleB = -100; }
        // @ts-ignore
        var buf = buffer_1.Buffer.from([0x0d, 0x00, 0x81, port, 0x11, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
        buf.writeUInt16LE(seconds * 1000, 6);
        buf.writeInt8(dutyCycleA, 8);
        buf.writeInt8(dutyCycleB, 9);
        return buf;
    };
    Hub.prototype.encodeMotorTime = function (port, seconds, dutyCycle) {
        if (dutyCycle === void 0) { dutyCycle = 100; }
        // @ts-ignore
        var buf = buffer_1.Buffer.from([0x0c, 0x00, 0x81, port, 0x11, 0x09, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
        buf.writeUInt16LE(seconds * 1000, 6);
        buf.writeInt8(dutyCycle, 8);
        return buf;
    };
    Hub.prototype.encodeMotorAngleMulti = function (port, angle, dutyCycleA, dutyCycleB) {
        if (dutyCycleA === void 0) { dutyCycleA = 100; }
        if (dutyCycleB === void 0) { dutyCycleB = -100; }
        // @ts-ignore
        var buf = buffer_1.Buffer.from([0x0f, 0x00, 0x81, port, 0x11, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
        buf.writeUInt32LE(angle, 6);
        buf.writeInt8(dutyCycleA, 10);
        buf.writeInt8(dutyCycleB, 11);
        return buf;
    };
    Hub.prototype.encodeMotorAngle = function (port, angle, dutyCycle) {
        if (dutyCycle === void 0) { dutyCycle = 100; }
        // @ts-ignore
        var buf = buffer_1.Buffer.from([0x0e, 0x00, 0x81, port, 0x11, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
        buf.writeUInt32LE(angle, 6);
        buf.writeInt8(dutyCycle, 10);
        return buf;
    };
    Hub.prototype.encodeLed = function (color) {
        if (color === false) {
            color = 'off';
        }
        else if (color === true) {
            color = 'white';
        }
        if (typeof color === 'string') {
            var colors = [
                'off',
                'pink',
                'purple',
                'blue',
                'lightblue',
                'cyan',
                'green',
                'yellow',
                'orange',
                'red',
                'white',
            ];
            color = colors.indexOf(color);
        }
        // @ts-ignore
        return buffer_1.Buffer.from([0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, color]);
    };
    return Hub;
}());
exports.Hub = Hub;
//# sourceMappingURL=hub.js.map