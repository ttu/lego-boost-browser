"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legoBoost_1 = require("./legoBoost");
var boostConnector_1 = require("./boostConnector");
var boost = new legoBoost_1.default();
// @ts-ignore
boost.logDebug = console.log;
// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.isWebBluetoothSupported = boostConnector_1.BoostConnector.isWebBluetoothSupported;
// @ts-ignore
window.connect = boost.connect.bind(boost);
// @ts-ignore
window.led = boost.changeLed.bind(boost);
// @ts-ignore
window.drive = boost.drive.bind(boost, 50);
// @ts-ignore
window.disconnect = boost.disconnect.bind(boost);
// @ts-ignore
window.ai = boost.ai.bind(boost);
// @ts-ignore
window.stop = boost.stop.bind(boost);
// @ts-ignore
window.turnLeft = boost.turn.bind(boost, 90 * 400);
// @ts-ignore
window.turnRight = boost.turn.bind(boost, 90 * 400 * -1);
// @ts-ignore
window.driveForward = boost.driveToDirection.bind(boost);
// @ts-ignore
window.driveBackward = boost.driveToDirection.bind(boost, -1);
// @ts-ignore
window.turnAPositive = boost.motorAngle.bind(boost, 'A', 3600, 10);
// @ts-ignore
window.turnANegative = boost.motorAngle.bind(boost, 'A', 3600, -10);
// @ts-ignore
window.rawCommand = boost.rawCommand.bind(boost, {
    0: 0x08,
    1: 0x00,
    2: 0x81,
    3: 0x32,
    4: 0x11,
    5: 0x51,
    6: 0x00,
    7: 0x02,
    8: 0x00,
    9: 0x00,
    10: 0x00,
    11: 0x00,
    12: 0x00,
    13: 0x00,
    14: 0x00,
});
//# sourceMappingURL=browser.js.map