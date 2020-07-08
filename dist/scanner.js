"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
var Scanner = /** @class */ (function () {
    function Scanner() {
    }
    Scanner.run = function () {
        var log = console.log.bind(console);
        // let filters = [];
        // let filterService = "heart_rate";
        // if (filterService.startsWith('0x')) {
        //    filterService = parseInt(filterService, 16);
        // }
        // if (filterService) {
        //   filters.push({ services: [filterService] });
        // }
        var options = { acceptAllDevices: true };
        // const options = { filters: filters };
        log('Requesting Bluetooth Device...');
        navigator.bluetooth
            .requestDevice(options)
            .then(function (device) {
            log('> Name:             ' + device.name);
            log('> Id:               ' + device.id);
            log('> UUIDs:            ' + device.uuids.join('\n' + ' '.repeat(20)));
            log('> Connected:        ' + device.gatt.connected);
        })
            .catch(function (error) { return log(error); });
    };
    return Scanner;
}());
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map