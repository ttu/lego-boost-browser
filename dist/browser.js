"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legoBoost_1 = require("./legoBoost");
var boost = new legoBoost_1.default();
// Add as a window globals, so these can be called from HTML
// @ts-ignore
window.connect = boost.connect.bind(boost);
// @ts-ignore
window.led = boost.changeLed.bind(boost);
// @ts-ignore
window.drive = boost.drive.bind(boost);
// @ts-ignore
window.disconnect = boost.disconnect.bind(boost);
// @ts-ignore
window.ai = boost.ai.bind(boost);
// @ts-ignore
window.stop = boost.stop.bind(boost);
//# sourceMappingURL=browser.js.map