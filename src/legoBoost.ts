import { BoostConnector } from './boostConnector';
import { HubAsync, BoostConfiguration } from './hub/hubAsync';
import { HubControl } from './ai/hub-control';

export default class LegoBoost {
  private hub: HubAsync;
  private hubControl: HubControl;
  private color: string;
  private updateTimer: any;
  private configuration: BoostConfiguration;

  private logDebug: (message?: any, ...optionalParams: any[]) => void = (s) => {};

  /**
   * Information from Lego Boost motos and sensors
   * @property LegoBoost#deviceInfo
   */
  public deviceInfo = {
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
    connected: false,
  };

  /**
   * Input data to used on manual control
   * @property LegoBoost#controlData
   */
  public controlData = {
    input: null,
    speed: 0,
    turnAngle: 0,
    tilt: { roll: 0, pitch: 0 },
    forceState: null,
    updateInputMode: null,
  };

  /**
   * Drive forward until wall is reaced or drive backwards 100meters
   * @method LegoBoost#connect
   * @param {BoostConfiguration} [configuration={}] Lego boost motor and control configuration
   * @returns {Promise}
   */
  async connect(configuration: BoostConfiguration = {}): Promise<void> {
    try {
      this.configuration = configuration;
      const characteristic = await BoostConnector.connect(this.handleGattDisconnect.bind(this));
      this.initHub(characteristic, this.configuration);
    } catch (e) {
      console.log('Error from connect: ' + e);
    }
  }

  private async initHub(characteristic, configuration) {
    this.hub = new HubAsync(characteristic, configuration);
    this.hub.logDebug = this.logDebug;

    this.hub.emitter.on('disconnect', async evt => {
      // TODO: This is never launched as event comes from BoostConnector
      // await BoostConnector.reconnect();
    });

    this.hub.emitter.on('connect', async evt => {
      this.hub.afterInitialization();
      await this.hub.ledAsync('white');
      this.logDebug('Connected');
    });

    this.hubControl = new HubControl(this.deviceInfo, this.controlData, configuration);
    await this.hubControl.start(this.hub);

    this.updateTimer = setInterval(() => {
      this.hubControl.update();
    }, 100);
  }

  private async handleGattDisconnect() {
    this.logDebug('handleGattDisconnect');

    if (this.deviceInfo.connected === false) return;

    this.hub.setDisconnected();
    this.deviceInfo.connected = false;
    clearInterval(this.updateTimer);
    this.logDebug('Disconnected');

    // TODO: Can't get autoreconnect to work
    // if (this.hub.noReconnect) {
    //   this.hub.setDisconnected();
    //   this.deviceInfo.connected = false;
    // } else {
    //   this.hub.setDisconnected();
    //   this.deviceInfo.connected = false;
    //   const reconnection = await BoostConnector.reconnect();
    //   if (reconnection[0]) {
    //     await this.initHub(reconnection[1], this.configuration);
    //   } else {
    //     this.logDebug('Reconnection failed');
    //   }
    // }
  }

  /**
   * Change the color of the led between pink and orange
   * @method LegoBoost#changeLed
   * @returns {Promise}
   */
  async changeLed(): Promise<void> {
    if (!this.hub || this.hub.connected === false) return;
    this.color = this.color === 'pink' ? 'orange' : 'pink';
    await this.hub.ledAsync(this.color);
  }

  /**
   * Drive forward until wall is reaced or drive backwards 100meters
   * @method LegoBoost#driveToDirection
   * @param {number} [direction=1] Direction to drive. 1 or positive is forward, 0 or negative is backwards.
   * @returns {Promise}
   */
  async driveToDirection(direction = 1): Promise<{}> {
    if (!this.preCheck()) return;
    if (direction > 0) return await this.hub.driveUntil();
    else return await this.hub.drive(-10000);
  }

  /**
   * Disconnect Lego Boost
   * @method LegoBoost#disconnect
   * @returns {Promise<boolean>}
   */
  async disconnect(): Promise<boolean> {
    if (!this.hub || this.hub.connected === false) return;
    this.hub.setDisconnected();
    const success = await BoostConnector.disconnect();
    return success;
  }

  /**
   * Start AI mode
   * @method LegoBoost#ai
   */
  ai(): void {
    if (!this.hub || this.hub.connected === false) return;
    this.hubControl.setNextState('Drive');
  }

  /**
   * Stop engines A and B
   * @method LegoBoost#stop
   * @returns {Promise}
   */
  async stop(): Promise<{}> {
    if (!this.preCheck()) return;
    this.controlData.speed = 0;
    this.controlData.turnAngle = 0;
    // control datas values might have always been 0, execute force stop
    return await this.hub.motorTimeMultiAsync(1, 0, 0);
  }

  /**
   * Update Boost motor and control configuration
   * @method LegoBoost#updateConfiguration
   * @param {BoostConfiguration} configuration Boost motor and control configuration
   */
  updateConfiguration(configuration: BoostConfiguration): void {
    if (!this.hub) return;
    this.hub.updateConfiguration(configuration);
    this.hubControl.updateConfiguration(configuration);
  }

  // Methods from Hub

  /**
   * Control the LED on the Move Hub
   * @method LegoBoost#led
   * @param {boolean|number|string} color
   * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
   * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
   * `white`
   */
  led(color): void {
    if (!this.preCheck()) return;
    this.hub.led(color);
  }

  /**
   * Control the LED on the Move Hub
   * @method LegoBoost#ledAsync
   * @param {boolean|number|string} color
   * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
   * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
   * `white`
   * @returns {Promise}
   */
  async ledAsync(color): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.ledAsync(color);
  }

  /**
   * Run a motor for specific time
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} seconds
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   */
  motorTime(port, seconds, dutyCycle = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorTime(port, seconds, dutyCycle);
  }

  /**
   * Run a motor for specific time
   * @method LegoBoost#motorTimeAsync
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} seconds
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
   * @returns {Promise}
   */
  async motorTimeAsync(port, seconds, dutyCycle = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorTimeAsync(port, seconds, dutyCycle, wait);
  }

  /**
   * Run both motors (A and B) for specific time
   * @param {number} seconds
   * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {function} callback
   */
  motorTimeMulti(seconds, dutyCycleA = 100, dutyCycleB = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorTimeMulti(seconds, dutyCycleA, dutyCycleB);
  }

  /**
   * Run both motors (A and B) for specific time
   * @method LegoBoost#motorTimeMultiAsync
   * @param {number} seconds
   * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
   * @returns {Promise}
   */
  async motorTimeMultiAsync(seconds, dutyCycleA = 100, dutyCycleB = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorTimeMultiAsync(seconds, dutyCycleA, dutyCycleB, wait);
  }

  /**
   * Turn a motor by specific angle
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} angle - degrees to turn from `0` to `2147483647`
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   */
  motorAngle(port, angle, dutyCycle = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorAngle(port, angle, dutyCycle);
  }

  /**
   * Turn a motor by specific angle
   * @method LegoBoost#motorAngleAsync
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} angle - degrees to turn from `0` to `2147483647`
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
   * @returns {Promise}
   */
  async motorAngleAsync(port, angle, dutyCycle = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorAngleAsync(port, angle, dutyCycle, wait);
  }

  /**
   * Turn both motors (A and B) by specific angle
   * @method LegoBoost#motorAngleMulti
   * @param {number} angle degrees to turn from `0` to `2147483647`
   * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   */
  motorAngleMulti(angle, dutyCycleA = 100, dutyCycleB = 100): void {
    if (!this.preCheck()) return;
    this.hub.motorAngleMulti(angle, dutyCycleA, dutyCycleB);
  }

  /**
   * Turn both motors (A and B) by specific angle
   * @method LegoBoost#motorAngleMultiAsync
   * @param {number} angle degrees to turn from `0` to `2147483647`
   * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
   * @returns {Promise}
   */
  async motorAngleMultiAsync(angle, dutyCycleA = 100, dutyCycleB = 100, wait = true): Promise<void> {
    if (!this.preCheck()) return;
    await this.hub.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
  }

  /**
   * Drive specified distance
   * @method LegoBoost#drive
   * @param {number} distance distance in centimeters (default) or inches. Positive is forward and negative is backward.
   * @param {boolean} [wait=true] will promise wait untill the drive has completed.
   * @returns {Promise}
   */
  async drive(distance, wait = true): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.drive(distance, wait);
  }

  /**
   * Turn robot specified degrees
   * @method LegoBoost#turn
   * @param {number} degrees degrees to turn. Negative is to the left and positive to the right.
   * @param {boolean} [wait=true] will promise wait untill the turn has completed.
   * @returns {Promise}
   */
  async turn(degrees, wait = true): Promise<{}> {
    if (!this.preCheck()) return;
    return await this.hub.turn(degrees, wait);
  }

  /**
   * Drive untill sensor shows object in defined distance
   * @method LegoBoost#driveUntil
   * @param {number} [distance=0] distance in centimeters (default) or inches when to stop. Distance sensor is not very sensitive or accurate.
   * By default will stop when sensor notices wall for the first time. Sensor distance values are usualy between 110-50.
   * @param {boolean} [wait=true] will promise wait untill the bot will stop.
   * @returns {Promise}
   */
  async driveUntil(distance = 0, wait = true): Promise<any> {
    if (!this.preCheck()) return;
    return await this.hub.driveUntil(distance, wait);
  }

  /**
   * Turn until there is no object in sensors sight
   * @method LegoBoost#turnUntil
   * @param {number} [direction=1] direction to turn to. 1 (or any positive) is to the right and 0 (or any negative) is to the left.
   * @param {boolean} [wait=true] will promise wait untill the bot will stop.
   * @returns {Promise}
   */
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
