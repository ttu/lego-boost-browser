import { BoostConnector } from './boostConnector';
import { Scanner } from './scanner';
// import { Hub } from './hub/hub';
import { HubAsync, IConfiguration } from './hub/hubAsync';
import { HubControl } from './ai/hub-control';

export default class LegoBoost {
  hub: HubAsync;
  hubControl: HubControl;
  color: string;

  deviceInfo = {
    ports: {
      A: { action: '', angle: 0 },
      B: { action: '', angle: 0 },
      AB: { action: '', angle: 0 },
      C: { action: '', angle: 0 },
      D: { action: '', angle: 0 },
      LED: { action: '', angle: 0 },
    },
    tilt: { roll: 0, pitch: 0 },
    distance: Number.MAX_SAFE_INTEGER,
    rssi: 0,
    color: '',
    error: '',
    connected: false
  };

  controlData = {
    input: null,
    speed: 0,
    turnAngle: 0,
    tilt: { roll: 0, pitch: 0 },
    forceState: null,
    updateInputMode: null
  };

  async connect(configuration?: IConfiguration): Promise<void> {
    try {
      const characteristic = await BoostConnector.connect();
      this.hub = new HubAsync(characteristic, configuration);

      this.hub.emitter.on('disconnect', async evt => {
        await BoostConnector.reconnect();
      });

      this.hub.emitter.on('connect', async evt => {
        this.hub.afterInitialization();
        await this.hub.ledAsync('purple');
      });

      this.hubControl = new HubControl(this.deviceInfo, this.controlData);
      await this.hubControl.start(this.hub);
      setInterval(() => {
        this.hubControl.update();
      }, 100);

    } catch (e) {
      console.log('Error from connect: ' + e);
    }
  }

  async changeLed(): Promise<void> {
    if (!this.hub || this.hub.connected === false) return;
    this.color = this.color === 'pink' ? 'orange' : 'pink';
    await this.hub.ledAsync(this.color);
  }

  async driveToDirection(direction = 1): Promise<{}> {
    if (!this.preCheck()) return;
    if (direction > 0)
      return await this.hub.driveUntil();
    else
      return await this.hub.drive(-10000);
  }

  async disconnect(): Promise<boolean> {
    if (!this.hub || this.hub.connected === false) return;
    this.hub.disconnect();
    return await BoostConnector.disconnect();
  }

  ai(): void {
    if (!this.hub || this.hub.connected === false) return;
    this.hubControl.setNextState('Drive');
  }

  async stop(): Promise<{}> {
    if (!this.preCheck()) return;
    this.controlData.speed = 0;
    this.controlData.turnAngle = 0;
    // control datas values might have always been 0, execute force stop
    return await this.hub.motorTimeMultiAsync(1, 0, 0);
  }

  // Methods from Hub

  led(color): void {
    if (!this.preCheck()) return;
    this.hub.led(color);
  }

  async ledAsync(color): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.ledAsync(color);
  }

  motorTime(port, seconds, dutyCycle = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorTime(port, seconds, dutyCycle);
  }

  async motorTimeAsync(port, seconds, dutyCycle = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorTimeAsync(port, seconds, dutyCycle, wait);
  }

  motorTimeMulti(seconds, dutyCycleA = 100, dutyCycleB = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorTimeMulti(seconds, dutyCycleA, dutyCycleB);
  }

  async motorTimeMultiAsync(seconds, dutyCycleA = 100, dutyCycleB = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorTimeMultiAsync(seconds, dutyCycleA, dutyCycleB, wait);
  }

  motorAngle(port, angle, dutyCycle = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorAngle(port, angle, dutyCycle);
  }

  async motorAngleAsync(port, angle, dutyCycle = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorAngleAsync(port, angle, dutyCycle, wait);
  }

  motorAngleMulti(angle, dutyCycleA = 100, dutyCycleB = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorAngleMulti(angle, dutyCycleA, dutyCycleB);
  }

  async motorAngleMultiAsync(angle, dutyCycleA = 100, dutyCycleB = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
  }

  async drive (distance, wait = true): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.drive(distance, wait);
  }

  async turn(degrees, wait = true): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.turn(degrees, wait);
  }

  async driveUntil(distance = 0, wait = true): Promise<any> {
    if (!this.preCheck()) return;
    return await this.hub.driveUntil(distance, wait);
  }

  async turnUntil(direction = 1, wait = true): Promise<any> {
    if (!this.preCheck()) return;
    return await this.hub.turnUntil(direction, wait);
  }

  private preCheck(): boolean {
    if (!this.hub || this.hub.connected === false) return false;
    this.hubControl.setNextState('Manual');
    return true;
  }
}