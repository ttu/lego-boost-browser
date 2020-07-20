/// <reference types="web-bluetooth" />
import { Hub } from './hub';
import { Motor } from '../types';
export declare const DEFAULT_CONFIG: {
    METRIC_MODIFIER: number;
    TURN_MODIFIER: number;
    DRIVE_SPEED: number;
    TURN_SPEED: number;
    DEFAULT_STOP_DISTANCE: number;
    DEFAULT_CLEAR_DISTANCE: number;
    LEFT_MOTOR: Motor;
    RIGHT_MOTOR: Motor;
    VALID_MOTORS: Motor[];
};
export interface BoostConfiguration {
    distanceModifier?: any;
    turnModifier?: any;
    defaultClearDistance?: any;
    defaultStopDistance?: any;
    leftMotor?: Motor;
    rightMotor?: Motor;
    driveSpeed?: number;
    turnSpeed?: number;
}
export declare class HubAsync extends Hub {
    hubDisconnected: boolean;
    configuration: BoostConfiguration;
    portData: any;
    useMetric: boolean;
    modifier: number;
    distance: number;
    constructor(bluetooth: BluetoothRemoteGATTCharacteristic, configuration: BoostConfiguration);
    /**
     * Disconnect Hub
     * @method Hub#disconnectAsync
     * @returns {Promise<boolean>} disconnection successful
     */
    disconnectAsync(): Promise<boolean>;
    /**
     * Execute this method after new instance of Hub is created
     * @method Hub#afterInitialization
     */
    afterInitialization(): void;
    /**
     * Control the LED on the Move Hub
     * @method Hub#ledAsync
     * @param {boolean|number|string} color
     * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
     * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
     * `white`
     * @returns {Promise}
     */
    ledAsync(color: boolean | number | string): Promise<any>;
    /**
     * Run a motor for specific time
     * @method Hub#motorTimeAsync
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} seconds
     * @param {number} [dutyCycle=100] motor power percentsage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
     * @returns {Promise}
     */
    motorTimeAsync(port: string | number, seconds: number, dutyCycle?: number, wait?: boolean): Promise<any>;
    /**
     * Run both motors (A and B) for specific time
     * @method Hub#motorTimeMultiAsync
     * @param {number} seconds
     * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
     * is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
     * @returns {Promise}
     */
    motorTimeMultiAsync(seconds: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<any>;
    /**
     * Turn a motor by specific angle
     * @method Hub#motorAngleAsync
     * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
     * @param {number} angle - degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
     * @returns {Promise}
     */
    motorAngleAsync(port: string | number, angle: number, dutyCycle?: number, wait?: boolean): Promise<any>;
    /**
     * Turn both motors (A and B) by specific angle
     * @method Hub#motorAngleMultiAsync
     * @param {number} angle degrees to turn from `0` to `2147483647`
     * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given
     * rotation is counterclockwise.
     * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
     * @returns {Promise}
     */
    motorAngleMultiAsync(angle: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<any>;
    /**
     * Use metric units (default)
     * @method Hub#useMetricUnits
     */
    useMetricUnits(): void;
    /**
     * Use imperial units
     * @method Hub#useImperialUnits
     */
    useImperialUnits(): void;
    /**
     * Set friction modifier
     * @method Hub#setFrictionModifier
     * @param {number} modifier friction modifier
     */
    setFrictionModifier(modifier: number): void;
    /**
     * Drive specified distance
     * @method Hub#drive
     * @param {number} distance distance in centimeters (default) or inches. Positive is forward and negative is backward.
     * @param {boolean} [wait=true] will promise wait untill the drive has completed.
     * @returns {Promise}
     */
    drive(distance: number, wait?: boolean): Promise<any>;
    /**
     * Turn robot specified degrees
     * @method Hub#turn
     * @param {number} degrees degrees to turn. Negative is to the left and positive to the right.
     * @param {boolean} [wait=true] will promise wait untill the turn has completed.
     * @returns {Promise}
     */
    turn(degrees: number, wait?: boolean): Promise<any>;
    /**
     * Drive untill sensor shows object in defined distance
     * @method Hub#driveUntil
     * @param {number} [distance=0] distance in centimeters (default) or inches when to stop. Distance sensor is not very sensitive or accurate.
     * By default will stop when sensor notices wall for the first time. Sensor distance values are usualy between 110-50.
     * @param {boolean} [wait=true] will promise wait untill the bot will stop.
     * @returns {Promise}
     */
    driveUntil(distance?: number, wait?: boolean): Promise<any>;
    /**
     * Turn until there is no object in sensors sight
     * @method Hub#turnUntil
     * @param {number} [direction=1] direction to turn to. 1 (or any positive) is to the right and 0 (or any negative) is to the left.
     * @param {boolean} [wait=true] will promise wait untill the bot will stop.
     * @returns {Promise}
     */
    turnUntil(direction?: number, wait?: boolean): Promise<any>;
    updateConfiguration(configuration: BoostConfiguration): void;
}
//# sourceMappingURL=hubAsync.d.ts.map