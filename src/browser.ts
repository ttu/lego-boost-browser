import LegoBoost from './legoBoost';
import { BoostConnector } from './boostConnector';

const boost = new LegoBoost();
// @ts-ignore
boost.logDebug = console.log;

// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.isWebBluetoothSupported = BoostConnector.isWebBluetoothSupported;
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
