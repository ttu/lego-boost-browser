import { BoostConfiguration, HubAsync } from '../hub/hubAsync';
import { ControlData, DeviceInfo, State } from '../types';
declare type States = {
    [key in State]: (hub: HubControl) => void;
};
declare class HubControl {
    hub: HubAsync;
    device: DeviceInfo;
    prevDevice: DeviceInfo;
    control: ControlData;
    prevControl: ControlData;
    configuration: BoostConfiguration;
    states: States;
    currentState: (hub: HubControl) => void;
    constructor(deviceInfo: DeviceInfo, controlData: ControlData, configuration: BoostConfiguration);
    updateConfiguration(configuration: BoostConfiguration): void;
    start(hub: HubAsync): Promise<void>;
    disconnect(): Promise<void>;
    setNextState(state: State): void;
    update(): void;
}
export { HubControl };
//# sourceMappingURL=hub-control.d.ts.map