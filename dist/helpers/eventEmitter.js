"use strict";
// https://gist.github.com/mudge/5830382#gistcomment-2658721
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (event, listener) {
        var _this = this;
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return function () { return _this.removeListener(event, listener); };
    };
    EventEmitter.prototype.removeListener = function (event, listener) {
        if (typeof this.events[event] !== 'object') {
            return;
        }
        var idx = this.events[event].indexOf(listener);
        if (idx > -1) {
            this.events[event].splice(idx, 1);
        }
    };
    EventEmitter.prototype.removeAllListeners = function () {
        var _this = this;
        Object.keys(this.events).forEach(function (event) { return _this.events[event].splice(0, _this.events[event].length); });
    };
    EventEmitter.prototype.emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof this.events[event] !== 'object') {
            return;
        }
        __spreadArrays(this.events[event]).forEach(function (listener) { return listener.apply(_this, args); });
    };
    EventEmitter.prototype.once = function (event, listener) {
        var _this = this;
        var remove = this.on(event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            remove();
            listener.apply(_this, args);
        });
        return remove;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=eventEmitter.js.map