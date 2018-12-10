"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var boostConnector_1 = require("./boostConnector");
var scanner_1 = require("./scanner");
// import { Hub } from "./hub/hub";
var hubAsync_1 = require("./hub/hubAsync");
var hub_control_1 = require("./ai/hub-control");
var LegoBoost = /** @class */ (function () {
    function LegoBoost() {
        this.deviceInfo = {
            ports: {
                A: { action: '', angle: 0 },
                B: { action: '', angle: 0 },
                AB: { action: '', angle: 0 },
                C: { action: '', angle: 0 },
                D: { action: '', angle: 0 },
                LED: { action: '', angle: 0 },
            },
            tilt: { roll: 0, pitch: 0 },
            distance: Number.MAX_SAFE_INTEGER,
            rssi: 0,
            color: '',
            error: '',
            connected: false
        };
        this.controlData = {
            input: null,
            speed: 0,
            turnAngle: 0,
            tilt: { roll: 0, pitch: 0 },
            forceState: null,
            updateInputMode: null
        };
    }
    LegoBoost.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var characteristic, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, boostConnector_1.BoostConnector.connect()];
                    case 1:
                        characteristic = _a.sent();
                        this.hub = new hubAsync_1.HubAsync(characteristic);
                        this.hub.emitter.on("disconnect", function (evt) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, boostConnector_1.BoostConnector.reconnect()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.hub.emitter.on("connect", function (evt) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.hub.ledAsync("purple")];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.hubControl = new hub_control_1.HubControl(this.deviceInfo, this.controlData);
                        return [4 /*yield*/, this.hubControl.start(this.hub)];
                    case 2:
                        _a.sent();
                        setInterval(function () {
                            _this.hubControl.update();
                        }, 100);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log("Error from connect: " + e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LegoBoost.prototype.changeLed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hub || this.hub.connected === false)
                            return [2 /*return*/];
                        this.color = this.color === 'pink' ? 'orange' : 'pink';
                        return [4 /*yield*/, this.hub.ledAsync(this.color)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LegoBoost.prototype.drive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hub || this.hub.connected === false)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.hub.motorTimeMultiAsync(2, 10, 10)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LegoBoost.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hub || this.hub.connected === false)
                            return [2 /*return*/];
                        this.hub.disconnect();
                        return [4 /*yield*/, boostConnector_1.BoostConnector.disconnect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LegoBoost.prototype.ai = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.hub || this.hub.connected === false)
                    return [2 /*return*/];
                this.hubControl.setNextState('Drive');
                return [2 /*return*/];
            });
        });
    };
    LegoBoost.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.controlData.speed = 0;
                        this.controlData.turnAngle = 0;
                        this.hubControl.setNextState('Manual');
                        // control datas values might have always been 0, execute force stop
                        return [4 /*yield*/, this.hub.motorTimeMultiAsync(1, 0, 0)];
                    case 1:
                        // control datas values might have always been 0, execute force stop
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LegoBoost.prototype.scan = function () {
        try {
            scanner_1.Scanner.run();
        }
        catch (e) {
            console.log("Error from scan: " + e);
        }
    };
    return LegoBoost;
}());
exports.default = LegoBoost;
// export { connect, scan, changeLed, drive, disconnect, ai, stop };
//# sourceMappingURL=legoBoost.js.map