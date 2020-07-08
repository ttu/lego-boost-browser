"use strict";
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
exports.BoostConnector = void 0;
var BOOST_HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
var BOOST_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';
var BoostConnector = /** @class */ (function () {
    function BoostConnector() {
    }
    BoostConnector.connect = function (disconnectCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = {
                            acceptAllDevices: false,
                            filters: [{ services: [BOOST_HUB_SERVICE_UUID] }],
                            optionalServices: [BOOST_HUB_SERVICE_UUID],
                        };
                        _a = this;
                        return [4 /*yield*/, navigator.bluetooth.requestDevice(options)];
                    case 1:
                        _a.device = _b.sent();
                        this.device.addEventListener('gattserverdisconnected', function (event) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, disconnectCallback()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // await this.device.watchAdvertisements();
                        // this.device.addEventListener('advertisementreceived', event => {
                        //   // @ts-ignore
                        //   console.log(event.rssi);
                        // });
                        return [2 /*return*/, BoostConnector.getCharacteristic(this.device)];
                }
            });
        });
    };
    BoostConnector.getCharacteristic = function (device) {
        return __awaiter(this, void 0, void 0, function () {
            var server, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, device.gatt.connect()];
                    case 1:
                        server = _a.sent();
                        return [4 /*yield*/, server.getPrimaryService(BOOST_HUB_SERVICE_UUID)];
                    case 2:
                        service = _a.sent();
                        return [4 /*yield*/, service.getCharacteristic(BOOST_CHARACTERISTIC_UUID)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BoostConnector.reconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bluetooth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.device) return [3 /*break*/, 2];
                        return [4 /*yield*/, BoostConnector.getCharacteristic(this.device)];
                    case 1:
                        bluetooth = _a.sent();
                        return [2 /*return*/, [true, bluetooth]];
                    case 2: return [2 /*return*/, [false, null]];
                }
            });
        });
    };
    BoostConnector.disconnect = function () {
        if (this.device) {
            this.device.gatt.disconnect();
            return true;
        }
        return false;
    };
    BoostConnector.isWebBluetoothSupported = navigator.bluetooth ? true : false;
    return BoostConnector;
}());
exports.BoostConnector = BoostConnector;
//# sourceMappingURL=boostConnector.js.map