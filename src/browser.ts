import { connect, scan, changeLed, drive } from "./functions";

// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.connect = connect;
// @ts-ignore
window.scan = scan;
// @ts-ignore
window.led = changeLed;
// @ts-ignore
window.drive = drive;