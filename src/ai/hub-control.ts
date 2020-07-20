import { manual } from './states/manual';
import { stop, back, drive, turn, seek } from './states/ai';
import { BoostConfiguration, HubAsync } from '../hub/hubAsync';
import { ControlData, DeviceInfo, State } from '../types';

type States = {
  [key in State]: (hub: HubControl) => void;
};

class HubControl {
  hub: HubAsync;
  device: DeviceInfo;
  prevDevice: DeviceInfo;
  control: ControlData;
  prevControl: ControlData;
  configuration: BoostConfiguration;
  states: States;
  currentState: (hub: HubControl) => void;

  constructor(deviceInfo: DeviceInfo, controlData: ControlData, configuration: BoostConfiguration) {
    this.hub = null;
    this.device = deviceInfo;
    this.control = controlData;
    this.configuration = configuration;
    this.prevControl = { ...this.control };

    this.states = {
      Turn: turn,
      Drive: drive,
      Stop: stop,
      Back: back,
      Manual: manual,
      Seek: seek,
    };

    this.currentState = this.states['Manual'];
  }

  updateConfiguration(configuration: BoostConfiguration): void {
    this.configuration = configuration;
  }

  async start(hub: HubAsync) {
    this.hub = hub;
    this.device.connected = true;

    this.hub.emitter.on('error', err => {
      this.device.err = err;
    });

    this.hub.emitter.on('disconnect', () => {
      this.device.connected = false;
    });

    this.hub.emitter.on('distance', distance => {
      this.device.distance = distance;
    });

    this.hub.emitter.on('rssi', rssi => {
      this.device.rssi = rssi;
    });

    this.hub.emitter.on('port', portObject => {
      const { port, action } = portObject;
      this.device.ports[port].action = action;
    });

    this.hub.emitter.on('color', color => {
      this.device.color = color;
    });

    this.hub.emitter.on('tilt', tilt => {
      const { roll, pitch } = tilt;
      this.device.tilt.roll = roll;
      this.device.tilt.pitch = pitch;
    });

    this.hub.emitter.on('rotation', rotation => {
      const { port, angle } = rotation;
      this.device.ports[port].angle = angle;
    });

    await this.hub.ledAsync('red');
    await this.hub.ledAsync('yellow');
    await this.hub.ledAsync('green');
  }

  async disconnect() {
    if (this.device.connected) {
      await this.hub.disconnectAsync();
    }
  }

  setNextState(state: State) {
    this.control.controlUpdateTime = undefined;
    this.control.state = state;
    this.currentState = this.states[state];
  }

  update() {
    // TODO: After removing bind, this requires some more refactoring
    this.currentState(this);

    // TODO: Deep clone
    this.prevControl = { ...this.control };
    this.prevControl.tilt = { ...this.control.tilt };
    this.prevDevice = { ...this.device };
  }
}

export { HubControl };
