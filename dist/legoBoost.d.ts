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
    driveUntil(distance?: number): Promise<void>;
    turnUntil(direction?: number): Promise<void>;
    disconnect(): Promise<void>;
    ai(): Promise<void>;
    stop(): Promise<void>;
    scan(): void;
}
//# sourceMappingURL=legoBoost.d.ts.map