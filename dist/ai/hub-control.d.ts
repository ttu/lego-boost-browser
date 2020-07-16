import { BoostConfiguration, HubAsync } from '../hub/hubAsync';
import { ControlData, DeviceInfo } from '../legoBoost';
declare class HubControl {
    hub: HubAsync;
    device: DeviceInfo;
    prevDevice: DeviceInfo;
    control: ControlData;
    prevControl: ControlData;
    configuration: BoostConfiguration;
    states: {
        Turn: () => void;
        Drive: () => void;
        Stop: () => void;
        Back: () => void;
        Manual: () => void;
        Seek: () => void;
    };
    currentState: () => void;
    constructor(deviceInfo: DeviceInfo, controlData: ControlData, configuration: BoostConfiguration);
    updateConfiguration(configuration: BoostConfiguration): void;
    start(hub: HubAsync): Promise<void>;
    disconnect(): Promise<void>;
    setNextState(state: string): void;
    update(): void;
}
export { HubControl };
//# sourceMappingURL=hub-control.d.ts.map