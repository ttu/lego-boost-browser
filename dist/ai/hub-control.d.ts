declare class HubControl {
    hub: any;
    device: any;
    control: any;
    prevControl: any;
    states: {
        Turn: any;
        Drive: any;
        Stop: any;
        Back: any;
        Manual: any;
        Seek: any;
    };
    currentState: any;
    prevDevice: any;
    constructor(deviceInfo: any, controlData: any);
    start(hub: any): Promise<void>;
    disconnect(): Promise<void>;
    setNextState(state: any): void;
    update(): void;
}
export { HubControl };
//# sourceMappingURL=hub-control.d.ts.map