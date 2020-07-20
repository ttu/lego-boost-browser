"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manual = void 0;
function manual(hubControl) {
    if (hubControl.control.speed !== hubControl.prevControl.speed || hubControl.control.turnAngle !== hubControl.prevControl.turnAngle) {
        var motorA = hubControl.control.speed + (hubControl.control.turnAngle > 0 ? Math.abs(hubControl.control.turnAngle) : 0);
        var motorB = hubControl.control.speed + (hubControl.control.turnAngle < 0 ? Math.abs(hubControl.control.turnAngle) : 0);
        if (motorA > 100) {
            motorB -= motorA - 100;
            motorA = 100;
        }
        if (motorB > 100) {
            motorA -= motorB - 100;
            motorB = 100;
        }
        hubControl.control.motorA = motorA;
        hubControl.control.motorB = motorB;
        hubControl.hub.motorTimeMulti(60, motorA, motorB);
    }
    if (hubControl.control.tilt.pitch !== hubControl.prevControl.tilt.pitch) {
        hubControl.hub.motorTime('C', 60, hubControl.control.tilt.pitch);
    }
    if (hubControl.control.tilt.roll !== hubControl.prevControl.tilt.roll) {
        hubControl.hub.motorTime('D', 60, hubControl.control.tilt.roll);
    }
}
exports.manual = manual;
//# sourceMappingURL=manual.js.map