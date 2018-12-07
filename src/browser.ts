import { connect, scan, changeLed, drive, disconnect, ai, stop } from "./functions";

// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.connect = connect;
// @ts-ignore
window.scan = scan;
// @ts-ignore
window.led = changeLed;
// @ts-ignore
window.drive = drive;
// @ts-ignore
window.disconnect = disconnect;
// @ts-ignore
window.ai = ai;
// @ts-ignore
window.stop = stop;