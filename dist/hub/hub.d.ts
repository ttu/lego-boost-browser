/// <reference types="web-bluetooth" />
import { EventEmitter } from '../helpers/eventEmitter';
export declare class Hub {
    emitter: EventEmitter<any>;
    characteristic: BluetoothRemoteGATTCharacteristic;
    log: (message?: any, ...optionalParams: any[]) => void;
    autoSubscribe: boolean;
    ports: any;
    num2type: any;
    port2num: any;
    num2port: any;
    num2action: any;
    num2color: any;
    portInfoTimeout: any;
    noReconnect: boolean;
    connected: boolean;
    rssi: number;
    reconnect: boolean;
    writeCue: any;
    isWritting: boolean;
    private emit;
    constructor(characteristic: BluetoothRemoteGATTCharacteristic);
    private addListeners;
    private parseMessage;
    private parseSensor;
    /**
     * Disconnect from Move Hub
     * @method Hub#disconnect
     */
    disconnect(): void;
    /**
     * Run a motor for specific time
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} seconds
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} [callback]
     */
    motorTime(port: any, seconds: any, dutyCycle: any, callback?: any): void;
    /**
     * Run both motors (A and B) for specific time
     * @param {number} seconds
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} callback
     */
    motorTimeMulti(seconds: any, dutyCycleA: any, dutyCycleB: any, callback?: any): void;
    /**
     * Turn a motor by specific angle
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} angle - degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} [callback]
     */
    motorAngle(port: any, angle: any, dutyCycle: any, callback?: any): void;
    /**
     * Turn both motors (A and B) by specific angle
     * @param {number} angle degrees to turn from `0` to `2147483647`
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} callback
     */
    motorAngleMulti(angle: any, dutyCycleA: any, dutyCycleB: any, callback?: any): void;
    motorPowerCommand(port: any, power: any): void;
    encodeMotorPower(port: any, dutyCycle?: number): any;
    /**
     * Control the LED on the Move Hub
     * @method Hub#led
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @param {function} [callback]
     */
    led(color: any, callback?: any): void;
    /**
     * Subscribe for sensor notifications
     * @param {string|number} port - e.g. call `.subscribe('C')` if you have your distance/color sensor on port C.
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    subscribe(port: any, option?: number, callback?: any): void;
    /**
     * Unsubscribe from sensor notifications
     * @param {string|number} port
     * @param {number} [option=0]. Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    unsubscribe(port: any, option: number, callback: any): void;
    subscribeAll(): void;
    /**
     * Send data over BLE
     * @method Hub#write
     * @param {string|Buffer} data If a string is given it has to have hex bytes separated by spaces, e.g. `0a 01 c3 b2`
     * @param {function} callback
     */
    write(data: any, callback?: any): void;
    writeFromCue(): void;
    encodeMotorTimeMulti(port: any, seconds: any, dutyCycleA?: number, dutyCycleB?: number): any;
    encodeMotorTime(port: any, seconds: any, dutyCycle?: number): any;
    encodeMotorAngleMulti(port: any, angle: any, dutyCycleA?: number, dutyCycleB?: number): any;
    encodeMotorAngle(port: any, angle: any, dutyCycle?: number): any;
    encodeLed(color: any): any;
}
//# sourceMappingURL=hub.d.ts.map