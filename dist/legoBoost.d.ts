import { HubAsync } from "./hub/hubAsync";
import { HubControl } from "./ai/hub-control";
export default class LegoBoost {
    hub: HubAsync;
    hubControl: HubControl;
    color: string;
    deviceInfo: {
        ports: {
            A: {
                action: string;
                angle: number;
            };
            B: {
                action: string;
                angle: number;
            };
            AB: {
                action: string;
                angle: number;
            };
            C: {
                action: string;
                angle: number;
            };
            D: {
                action: string;
                angle: number;
            };
            LED: {
                action: string;
                angle: number;
            };
        };
        tilt: {
            roll: number;
            pitch: number;
        };
        distance: number;
        rssi: number;
        color: string;
        error: string;
        connected: boolean;
    };
    controlData: {
        input: any;
        speed: number;
        turnAngle: number;
        tilt: {
            roll: number;
            pitch: number;
        };
        forceState: any;
        updateInputMode: any;
    };
    connect(): Promise<void>;
    changeLed(): Promise<void>;
    driveToDirection(direction?: number): Promise<void>;
    disconnect(): Promise<void>;
    ai(): Promise<void>;
    stop(): Promise<void>;
    led(color: any): void;
    ledAsync(color: any): Promise<void>;
    motorTime(port: any, seconds: any, dutyCycle?: number): void;
    motorTimeAsync(port: any, seconds: any, dutyCycle?: number, wait?: boolean): Promise<void>;
    motorTimeMulti(seconds: any, dutyCycleA?: number, dutyCycleB?: number): void;
    motorTimeMultiAsync(seconds: any, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
    motorAngle(port: any, angle: any, dutyCycle?: number): void;
    motorAngleAsync(port: any, angle: any, dutyCycle?: number, wait?: boolean): Promise<void>;
    motorAngleMulti(angle: any, dutyCycleA?: number, dutyCycleB?: number): void;
    motorAngleMultiAsync(angle: any, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
    drive(distance: any, wait?: boolean): void;
    turn(degrees: any, wait?: boolean): void;
    driveUntil(distance?: number, wait?: boolean): Promise<void>;
    turnUntil(direction?: number, wait?: boolean): Promise<void>;
    private preCheck;
}
//# sourceMappingURL=legoBoost.d.ts.map