/// <reference types="web-bluetooth" />
import { EventEmitter } from '../helpers/eventEmitter';
import { RawData } from '../types';
declare type Device = 'LED' | 'DISTANCE' | 'IMOTOR' | 'MOTOR' | 'TILT';
declare type Port = 'A' | 'B' | 'C' | 'D' | 'AB' | 'LED' | 'TILT';
declare type LedColor = 'off' | 'pink' | 'purple' | 'blue' | 'lightblue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'white';
export declare class Hub {
    emitter: EventEmitter<any>;
    bluetooth: BluetoothRemoteGATTCharacteristic;
    log: (message?: any, ...optionalParams: any[]) => void;
    logDebug: (message?: any, ...optionalParams: any[]) => void;
    autoSubscribe: boolean;
    ports: {
        [key: string]: any;
    };
    num2type: {
        [key: number]: Device;
    };
    port2num: {
        [key in Port]: number;
    };
    num2port: {
        [key: number]: string;
    };
    num2action: {
        [key: number]: string;
    };
    num2color: {
        [key: number]: string;
    };
    ledColors: LedColor[];
    portInfoTimeout: number;
    noReconnect: boolean;
    connected: boolean;
    rssi: number;
    reconnect: boolean;
    writeCue: any;
    isWriting: boolean;
    private emit;
    constructor(bluetooth: BluetoothRemoteGATTCharacteristic);
    private addListeners;
    private parseMessage;
    private parseSensor;
    /**
     * Set Move Hub as disconnected
     * @method Hub#setDisconnected
     */
    setDisconnected(): void;
    /**
     * Run a motor for specific time
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} seconds
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} [callback]
     */
    motorTime(port: string | number, seconds: number, dutyCycle: number, callback?: () => void): void;
    /**
     * Run both motors (A and B) for specific time
     * @param {number} seconds
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {function} callback
     */
    motorTimeMulti(seconds: number, dutyCycleA: number, dutyCycleB: number, callback?: () => void): void;
    /**
     * Turn a motor by specific angle
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} angle - degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} [callback]
     */
    motorAngle(port: string | number, angle: number, dutyCycle: number, callback?: () => void): void;
    /**
     * Turn both motors (A and B) by specific angle
     * @param {number} angle degrees to turn from `0` to `2147483647`
     * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {function} callback
     */
    motorAngleMulti(angle: number, dutyCycleA: number, dutyCycleB: number, callback?: () => void): void;
    /**
     * Send raw data
     * @param {object} raw raw data
     * @param {function} callback
     */
    rawCommand(raw: RawData, callback?: () => void): void;
    motorPowerCommand(port: any, power: number): void;
    encodeMotorPower(port: string | number, dutyCycle?: number): any;
    /**
     * Control the LED on the Move Hub
     * @method Hub#led
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @param {function} [callback]
     */
    led(color: string | number | boolean, callback?: () => void): void;
    /**
     * Subscribe for sensor notifications
     * @param {string|number} port - e.g. call `.subscribe('C')` if you have your distance/color sensor on port C.
     * @param {number} [option=0] Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    subscribe(port: string | number, option?: number, callback?: () => void): void;
    /**
     * Unsubscribe from sensor notifications
     * @param {string|number} port
     * @param {number} [option=0] Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
     * @param {function} [callback]
     */
    unsubscribe(port: string | number, option: number, callback: () => void): void;
    subscribeAll(): void;
    /**
     * Send data over BLE
     * @method Hub#write
     * @param {string|Buffer} data If a string is given it has to have hex bytes separated by spaces, e.g. `0a 01 c3 b2`
     * @param {function} callback
     */
    write(data: any, callback?: () => void): void;
    writeFromCue(): void;
    encodeMotorTimeMulti(port: number, seconds: number, dutyCycleA?: number, dutyCycleB?: number): any;
    encodeMotorTime(port: number, seconds: number, dutyCycle?: number): any;
    encodeMotorAngleMulti(port: number, angle: number, dutyCycleA?: number, dutyCycleB?: number): any;
    encodeMotorAngle(port: number, angle: number, dutyCycle?: number): any;
    encodeLed(color: string | number | boolean): any;
}
export {};
//# sourceMappingURL=hub.d.ts.map