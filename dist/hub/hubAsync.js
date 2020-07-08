"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubAsync = exports.DEFAULT_CONFIG = void 0;
var hub_1 = require("./hub");
var CALLBACK_TIMEOUT_MS = 1000 / 3;
exports.DEFAULT_CONFIG = {
    METRIC_MODIFIER: 28.5,
    TURN_MODIFIER: 2.56,
    DRIVE_SPEED: 25,
    TURN_SPEED: 20,
    DEFAULT_STOP_DISTANCE: 105,
    DEFAULT_CLEAR_DISTANCE: 120,
    LEFT_MOTOR: 'A',
    RIGHT_MOTOR: 'B',
    VALID_MOTORS: ['A', 'B'],
};
var validateConfiguration = function (configuration) {
    configuration.leftMotor = configuration.leftMotor || exports.DEFAULT_CONFIG.LEFT_MOTOR;
    configuration.rightMotor = configuration.rightMotor || exports.DEFAULT_CONFIG.RIGHT_MOTOR;
    // @ts-ignore
    if (!exports.DEFAULT_CONFIG.VALID_MOTORS.includes(configuration.leftMotor))
        throw Error('Define left port port correctly');
    // @ts-ignore
    if (!exports.DEFAULT_CONFIG.VALID_MOTORS.includes(configuration.rightMotor))
        throw Error('Define right port port correctly');
    if (configuration.leftMotor === configuration.rightMotor)
        throw Error('Left and right motor can not be same');
    configuration.distanceModifier = configuration.distanceModifier || exports.DEFAULT_CONFIG.METRIC_MODIFIER;
    configuration.turnModifier = configuration.turnModifier || exports.DEFAULT_CONFIG.TURN_MODIFIER;
    configuration.driveSpeed = configuration.driveSpeed || exports.DEFAULT_CONFIG.DRIVE_SPEED;
    configuration.turnSpeed = configuration.turnSpeed || exports.DEFAULT_CONFIG.TURN_SPEED;
    configuration.defaultStopDistance = configuration.defaultStopDistance || exports.DEFAULT_CONFIG.DEFAULT_STOP_DISTANCE;
    configuration.defaultClearDistance = configuration.defaultClearDistance || exports.DEFAULT_CONFIG.DEFAULT_CLEAR_DISTANCE;
};
var waitForValueToSet = function (valueName, compareFunc, timeoutMs) {
    var _this = this;
    if (compareFunc === void 0) { compareFunc = function (valueNameToCompare) { return _this[valueNameToCompare]; }; }
    if (timeoutMs === void 0) { timeoutMs = 0; }
    if (compareFunc.bind(this)(valueName))
        return Promise.resolve(this[valueName]);
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = resolve;
                    return [4 /*yield*/, waitForValueToSet.bind(this)(valueName, compareFunc, timeoutMs)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); }, timeoutMs + 100);
    });
};
var HubAsync = /** @class */ (function (_super) {
    __extends(HubAsync, _super);
    function HubAsync(bluetooth, configuration) {
        var _this = _super.call(this, bluetooth) || this;
        validateConfiguration(configuration);
        _this.configuration = configuration;
        return _this;
    }
    /**
     * Disconnect Hub
     * @method Hub#disconnectAsync
     * @returns {Promise<boolean>} disconnection successful
     */
    HubAsync.prototype.disconnectAsync = function () {
        this.setDisconnected();
        return waitForValueToSet.bind(this)('hubDisconnected');
    };
    /**
     * Execute this method after new instance of Hub is created
     * @method Hub#afterInitialization
     */
    HubAsync.prototype.afterInitialization = function () {
        var _this = this;
        this.hubDisconnected = null;
        this.portData = {
            A: { angle: 0 },
            B: { angle: 0 },
            AB: { angle: 0 },
            C: { angle: 0 },
            D: { angle: 0 },
            LED: { angle: 0 },
        };
        this.useMetric = true;
        this.modifier = 1;
        this.emitter.on('rotation', function (rotation) { return (_this.portData[rotation.port].angle = rotation.angle); });
        this.emitter.on('disconnect', function () { return (_this.hubDisconnected = true); });
        this.emitter.on('distance', function (distance) { return (_this.distance = distance); });
    };
    /**
     * Control the LED on the Move Hub
     * @method Hub#ledAsync
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @returns {Promise}
     */
    HubAsync.prototype.ledAsync = function (color) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.led(color, function () {
                // Callback is executed when command is sent and it will take some time before MoveHub executes the command
                setTimeout(resolve, CALLBACK_TIMEOUT_MS);
            });
        });
    };
    /**
     * Run a motor for specific time
     * @method Hub#motorTimeAsync
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} seconds
     * @param {number} [dutyCycle=100] motor power percentsage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
     * @returns {Promise}
     */
    HubAsync.prototype.motorTimeAsync = function (port, seconds, dutyCycle, wait) {
        var _this = this;
        if (dutyCycle === void 0) { dutyCycle = 100; }
        if (wait === void 0) { wait = false; }
        return new Promise(function (resolve, _) {
            _this.motorTime(port, seconds, dutyCycle, function () {
                setTimeout(resolve, wait ? CALLBACK_TIMEOUT_MS + seconds * 1000 : CALLBACK_TIMEOUT_MS);
            });
        });
    };
    /**
     * Run both motors (A and B) for specific time
     * @method Hub#motorTimeMultiAsync
     * @param {number} seconds
     * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
     * @returns {Promise}
     */
    HubAsync.prototype.motorTimeMultiAsync = function (seconds, dutyCycleA, dutyCycleB, wait) {
        var _this = this;
        if (dutyCycleA === void 0) { dutyCycleA = 100; }
        if (dutyCycleB === void 0) { dutyCycleB = 100; }
        if (wait === void 0) { wait = false; }
        return new Promise(function (resolve, _) {
            _this.motorTimeMulti(seconds, dutyCycleA, dutyCycleB, function () {
                setTimeout(resolve, wait ? CALLBACK_TIMEOUT_MS + seconds * 1000 : CALLBACK_TIMEOUT_MS);
            });
        });
    };
    /**
     * Turn a motor by specific angle
     * @method Hub#motorAngleAsync
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} angle - degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
     * @returns {Promise}
     */
    HubAsync.prototype.motorAngleAsync = function (port, angle, dutyCycle, wait) {
        var _this = this;
        if (dutyCycle === void 0) { dutyCycle = 100; }
        if (wait === void 0) { wait = false; }
        return new Promise(function (resolve, _) {
            _this.motorAngle(port, angle, dutyCycle, function () { return __awaiter(_this, void 0, void 0, function () {
                var beforeTurn;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!wait) return [3 /*break*/, 5];
                            beforeTurn = void 0;
                            _a.label = 1;
                        case 1:
                            beforeTurn = this.portData[port].angle;
                            return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, CALLBACK_TIMEOUT_MS); })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (this.portData[port].angle !== beforeTurn) return [3 /*break*/, 1];
                            _a.label = 4;
                        case 4:
                            resolve();
                            return [3 /*break*/, 6];
                        case 5:
                            setTimeout(resolve, CALLBACK_TIMEOUT_MS);
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /**
     * Turn both motors (A and B) by specific angle
     * @method Hub#motorAngleMultiAsync
     * @param {number} angle degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
     * @returns {Promise}
     */
    HubAsync.prototype.motorAngleMultiAsync = function (angle, dutyCycleA, dutyCycleB, wait) {
        var _this = this;
        if (dutyCycleA === void 0) { dutyCycleA = 100; }
        if (dutyCycleB === void 0) { dutyCycleB = 100; }
        if (wait === void 0) { wait = false; }
        return new Promise(function (resolve, _) {
            _this.motorAngleMulti(angle, dutyCycleA, dutyCycleB, function () { return __awaiter(_this, void 0, void 0, function () {
                var beforeTurn;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!wait) return [3 /*break*/, 5];
                            beforeTurn = void 0;
                            _a.label = 1;
                        case 1:
                            beforeTurn = this.portData['AB'].angle;
                            return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, CALLBACK_TIMEOUT_MS); })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (this.portData['AB'].angle !== beforeTurn) return [3 /*break*/, 1];
                            _a.label = 4;
                        case 4:
                            resolve();
                            return [3 /*break*/, 6];
                        case 5:
                            setTimeout(resolve, CALLBACK_TIMEOUT_MS);
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /**
     * Use metric units (default)
     * @method Hub#useMetricUnits
     */
    HubAsync.prototype.useMetricUnits = function () {
        this.useMetric = true;
    };
    /**
     * Use imperial units
     * @method Hub#useImperialUnits
     */
    HubAsync.prototype.useImperialUnits = function () {
        this.useMetric = false;
    };
    /**
     * Set friction modifier
     * @method Hub#setFrictionModifier
     * @param {number} modifier friction modifier
     */
    HubAsync.prototype.setFrictionModifier = function (modifier) {
        this.modifier = modifier;
    };
    /**
     * Drive specified distance
     * @method Hub#drive
     * @param {number} distance distance in centimeters (default) or inches. Positive is forward and negative is backward.
     * @param {boolean} [wait=true] will promise wait untill the drive has completed.
     * @returns {Promise}
     */
    HubAsync.prototype.drive = function (distance, wait) {
        if (wait === void 0) { wait = true; }
        var angle = Math.abs(distance) *
            ((this.useMetric ? this.configuration.distanceModifier : this.configuration.distanceModifier / 4) *
                this.modifier);
        var dutyCycleA = this.configuration.driveSpeed * (distance > 0 ? 1 : -1) * (this.configuration.leftMotor === 'A' ? 1 : -1);
        var dutyCycleB = this.configuration.driveSpeed * (distance > 0 ? 1 : -1) * (this.configuration.leftMotor === 'A' ? 1 : -1);
        return this.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
    };
    /**
     * Turn robot specified degrees
     * @method Hub#turn
     * @param {number} degrees degrees to turn. Negative is to the left and positive to the right.
     * @param {boolean} [wait=true] will promise wait untill the turn has completed.
     * @returns {Promise}
     */
    HubAsync.prototype.turn = function (degrees, wait) {
        if (wait === void 0) { wait = true; }
        var angle = Math.abs(degrees) * this.configuration.turnModifier;
        var turnMotorModifier = this.configuration.leftMotor === 'A' ? 1 : -1;
        var leftTurn = this.configuration.turnSpeed * (degrees > 0 ? 1 : -1) * turnMotorModifier;
        var rightTurn = this.configuration.turnSpeed * (degrees > 0 ? -1 : 1) * turnMotorModifier;
        var dutyCycleA = this.configuration.leftMotor === 'A' ? leftTurn : rightTurn;
        var dutyCycleB = this.configuration.leftMotor === 'A' ? rightTurn : leftTurn;
        return this.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
    };
    /**
     * Drive untill sensor shows object in defined distance
     * @method Hub#driveUntil
     * @param {number} [distance=0] distance in centimeters (default) or inches when to stop. Distance sensor is not very sensitive or accurate.
     * By default will stop when sensor notices wall for the first time. Sensor distance values are usualy between 110-50.
     * @param {boolean} [wait=true] will promise wait untill the bot will stop.
     * @returns {Promise}
     */
    HubAsync.prototype.driveUntil = function (distance, wait) {
        if (distance === void 0) { distance = 0; }
        if (wait === void 0) { wait = true; }
        return __awaiter(this, void 0, void 0, function () {
            var distanceCheck, direction, compareFunc;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        distanceCheck = distance !== 0 ? (this.useMetric ? distance : distance * 2.54) : this.configuration.defaultStopDistance;
                        direction = this.configuration.leftMotor === 'A' ? 1 : -1;
                        compareFunc = direction === 1 ? function () { return distanceCheck >= _this.distance; } : function () { return distanceCheck <= _this.distance; };
                        this.motorTimeMulti(60, this.configuration.driveSpeed * direction, this.configuration.driveSpeed * direction);
                        if (!wait) return [3 /*break*/, 3];
                        return [4 /*yield*/, waitForValueToSet.bind(this)('distance', compareFunc)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.motorAngleMultiAsync(0)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, waitForValueToSet
                            .bind(this)('distance', compareFunc)
                            .then(function (_) { return _this.motorAngleMulti(0, 0, 0); })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Turn until there is no object in sensors sight
     * @method Hub#turnUntil
     * @param {number} [direction=1] direction to turn to. 1 (or any positive) is to the right and 0 (or any negative) is to the left.
     * @param {boolean} [wait=true] will promise wait untill the bot will stop.
     * @returns {Promise}
     */
    HubAsync.prototype.turnUntil = function (direction, wait) {
        if (direction === void 0) { direction = 1; }
        if (wait === void 0) { wait = true; }
        return __awaiter(this, void 0, void 0, function () {
            var directionModifier;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        directionModifier = direction > 0 ? 1 : -1;
                        this.turn(360 * directionModifier, false);
                        if (!wait) return [3 /*break*/, 3];
                        return [4 /*yield*/, waitForValueToSet.bind(this)('distance', function () { return _this.distance >= _this.configuration.defaultClearDistance; })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.turn(0, false)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, waitForValueToSet
                            .bind(this)('distance', function () { return _this.distance >= _this.configuration.defaultClearDistance; })
                            .then(function (_) { return _this.turn(0, false); })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HubAsync.prototype.updateConfiguration = function (configuration) {
        validateConfiguration(configuration);
        this.configuration = configuration;
    };
    return HubAsync;
}(hub_1.Hub));
exports.HubAsync = HubAsync;
//# sourceMappingURL=hubAsync.js.map