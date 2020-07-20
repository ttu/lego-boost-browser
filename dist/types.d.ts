export declare type State = 'Turn' | 'Drive' | 'Stop' | 'Back' | 'Manual' | 'Seek';
export declare type Motor = 'A' | 'B';
export declare type TurnDirection = 'left' | 'right';
/** Information from Lego Boost motors and sensors */
export declare type DeviceInfo = {
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
    err?: any;
};
/** Input data to used on manual and AI control */
export declare type ControlData = {
    input: string;
    speed: number;
    turnAngle: number;
    turnDirection?: TurnDirection;
    tilt: {
        roll: number;
        pitch: number;
    };
    /** Force state change manually */
    forceState: State;
    /** Manually toggle input mode */
    updateInputMode: (controlData: ControlData) => void;
    /** Time stamp when control data was updated */
    controlUpdateTime?: number;
    state?: State;
    motorA?: number;
    motorB?: number;
};
export declare type RawData = {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9?: number;
    10?: number;
    11?: number;
    12?: number;
    13?: number;
    14?: number;
};
//# sourceMappingURL=types.d.ts.map