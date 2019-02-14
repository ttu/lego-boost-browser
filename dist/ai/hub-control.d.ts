import { IConfiguration, HubAsync } from '../hub/hubAsync';
declare class HubControl {
    hub: HubAsync;
    device: any;
    control: any;
    configuration: IConfiguration;
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
    constructor(deviceInfo: any, controlData: any, configuration: IConfiguration);
    updateConfiguration(configuration: IConfiguration): void;
    start(hub: HubAsync): Promise<void>;
    disconnect(): Promise<void>;
    setNextState(state: any): void;
    update(): void;
}
export { HubControl };
//# sourceMappingURL=hub-control.d.ts.map