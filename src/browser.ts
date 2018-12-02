import { connect, scan } from "./functions";

// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.connect = connect;
// @ts-ignore
window.scan = scan;