import { EventEmitter } from '../helpers/eventEmitter';
import { Buffer } from '../helpers/buffer';

type Device = 'LED' | 'DISTANCE' | 'IMOTOR' | 'MOTOR' | 'TILT';
type Port = 'A' | 'B' | 'C' | 'D' | 'AB' | 'LED' | 'TILT';
type LedColor =
  | 'off'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'lightblue'
  | 'cyan'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'white';

export class Hub {
  emitter: EventEmitter<any> = new EventEmitter<any>();
  characteristic: BluetoothRemoteGATTCharacteristic;

  log: (message?: any, ...optionalParams: any[]) => void;
  logDebug: (message?: any, ...optionalParams: any[]) => void;

  autoSubscribe: boolean = true;
  ports: { [key: string]: any };
  num2type: { [key: number]: Device };
  port2num: { [key in Port]: number };
  num2port: { [key: number]: string };
  num2action: { [key: number]: string };
  num2color: { [key: number]: string };
  ledColors: LedColor[];
  portInfoTimeout: number;
  noReconnect: boolean;
  connected: boolean;
  rssi: number;
  reconnect: boolean;

  writeCue: any = [];
  isWriting: boolean = false;

  private emit(type: string, data: any = null) {
    this.emitter.emit(type, data);
  }

  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
    this.log = console.log;
    this.autoSubscribe = true;
    this.ports = {};
    this.num2type = {
      23: 'LED',
      37: 'DISTANCE',
      38: 'IMOTOR',
      39: 'MOTOR',
      40: 'TILT',
    };
    this.port2num = {
      A: 0x00,
      B: 0x01,
      C: 0x02,
      D: 0x03,
      AB: 0x10,
      LED: 0x32,
      TILT: 0x3a,
    };
    this.num2port = Object.entries(this.port2num).reduce((acc, [port, portNum]) => {
      acc[portNum] = port;
      return acc;
    }, {});
    this.num2action = {
      1: 'start',
      5: 'conflict',
      10: 'stop',
    };
    this.num2color = {
      0: 'black',
      3: 'blue',
      5: 'green',
      7: 'yellow',
      9: 'red',
      10: 'white',
    };
    this.ledColors = [
      'off',
      'pink',
      'purple',
      'blue',
      'lightblue',
      'cyan',
      'green',
      'yellow',
      'orange',
      'red',
      'white',
    ];

    this.addListeners();
  }

  private addListeners() {
    this.characteristic.addEventListener('characteristicvaluechanged', event => {
      // https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
      // @ts-ignore
      const data = Buffer.from(event.target.value.buffer);
      this.parseMessage(data);
    });

    setTimeout(() => {
      // Without timout missed first characteristicvaluechanged events
      this.characteristic.startNotifications();
    }, 1000);
  }

  private parseMessage(data: any) {
    switch (data[2]) {
      case 0x04: {
        clearTimeout(this.portInfoTimeout);
        this.portInfoTimeout = setTimeout(() => {
          /**
           * Fires when a connection to the Move Hub is established
           * @event Hub#connect
           */
          if (this.autoSubscribe) {
            this.subscribeAll();
          }

          if (!this.connected) {
            this.connected = true;
            this.emit('connect');
          }
        }, 1000);

        this.log('Found: ' + this.num2type[data[5]]);
        this.logDebug('Found', data);

        if (data[4] === 0x01) {
          this.ports[data[3]] = {
            type: 'port',
            deviceType: this.num2type[data[5]],
            deviceTypeNum: data[5],
          };
        } else if (data[4] === 0x02) {
          this.ports[data[3]] = {
            type: 'group',
            deviceType: this.num2type[data[5]],
            deviceTypeNum: data[5],
            members: [data[7], data[8]],
          };
        }
        break;
      }
      case 0x05: {
        this.log('Malformed message');
        this.log('<', data);
        break;
      }
      case 0x45: {
        this.parseSensor(data);
        break;
      }
      case 0x47: {
        // 0x47 subscription acknowledgements
        // https://github.com/JorgePe/BOOSTreveng/blob/master/Notifications.md
        break;
      }
      case 0x82: {
        /**
         * Fires on port changes
         * @event Hub#port
         * @param port {object}
         * @param port.port {string}
         * @param port.action {string}
         */
        this.emit('port', {
          port: this.num2port[data[3]],
          action: this.num2action[data[4]],
        });
        break;
      }
      default:
        this.log('unknown message type 0x' + data[2].toString(16));
        this.log('<', data);
    }
  }

  private parseSensor(data: any) {
    if (!this.ports[data[3]]) {
      this.log('parseSensor unknown port 0x' + data[3].toString(16));
      return;
    }
    switch (this.ports[data[3]].deviceType) {
      case 'DISTANCE': {
        /**
         * @event Hub#color
         * @param color {string}
         */
        this.emit('color', this.num2color[data[4]]);

        // TODO: improve distance calculation!
        let distance: number;
        if (data[7] > 0 && data[5] < 2) {
          distance = Math.floor(20 - data[7] * 2.85);
        } else if (data[5] > 9) {
          distance = Infinity;
        } else {
          distance = Math.floor(20 + data[5] * 18);
        }
        /**
         * @event Hub#distance
         * @param distance {number} distance in millimeters
         */
        this.emit('distance', distance);
        break;
      }
      case 'TILT': {
        const roll = data.readInt8(4);
        const pitch = data.readInt8(5);

        /**
         * @event Hub#tilt
         * @param tilt {object}
         * @param tilt.roll {number}
         * @param tilt.pitch {number}
         */
        this.emit('tilt', { roll, pitch });
        break;
      }
      case 'MOTOR':
      case 'IMOTOR': {
        const angle = data.readInt32LE(4);

        /**
         * @event Hub#rotation
         * @param rotation {object}
         * @param rotation.port {string}
         * @param rotation.angle
         */
        this.emit('rotation', {
          port: this.num2port[data[3]],
          angle,
        });
        break;
      }
      default:
        this.log('unknown sensor type 0x' + data[3].toString(16), data[3], this.ports[data[3]].deviceType);
    }
  }

  /**
   * Set Move Hub as disconnected
   * @method Hub#setDisconnected
   */
  setDisconnected() {
    // TODO: Should get this from some notification?
    this.connected = false;
    this.noReconnect = true;
    this.writeCue = [];
  }

  /**
   * Run a motor for specific time
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} seconds
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
   * is counterclockwise.
   * @param {function} [callback]
   */
  motorTime(port: string | number, seconds: number, dutyCycle: number, callback?: () => void) {
    if (typeof dutyCycle === 'function') {
      callback = dutyCycle;
      dutyCycle = 100;
    }
    const portNum = typeof port === 'string' ? this.port2num[port] : port;
    this.write(this.encodeMotorTime(portNum, seconds, dutyCycle), callback);
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
  motorTimeMulti(seconds: number, dutyCycleA: number, dutyCycleB: number, callback?: () => void) {
    this.write(this.encodeMotorTimeMulti(this.port2num['AB'], seconds, dutyCycleA, dutyCycleB), callback);
  }

  /**
   * Turn a motor by specific angle
   * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
   * @param {number} angle - degrees to turn from `0` to `2147483647`
   * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {function} [callback]
   */
  motorAngle(port: string | number, angle: number, dutyCycle: number, callback?: () => void) {
    if (typeof dutyCycle === 'function') {
      callback = dutyCycle;
      dutyCycle = 100;
    }
    const portNum = typeof port === 'string' ? this.port2num[port] : port;
    this.write(this.encodeMotorAngle(portNum, angle, dutyCycle), callback);
  }

  /**
   * Turn both motors (A and B) by specific angle
   * @param {number} angle degrees to turn from `0` to `2147483647`
   * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
   * rotation is counterclockwise.
   * @param {function} callback
   */
  motorAngleMulti(angle: number, dutyCycleA: number, dutyCycleB: number, callback?: () => void) {
    this.write(this.encodeMotorAngleMulti(this.port2num['AB'], angle, dutyCycleA, dutyCycleB), callback);
  }

  motorPowerCommand(port: any, power: number) {
    this.write(this.encodeMotorPower(port, power));
  }

  //[0x09, 0x00, 0x81, 0x39, 0x11, 0x07, 0x00, 0x64, 0x03]
  encodeMotorPower(port: string | number, dutyCycle = 100) {
    const portNum = typeof port === 'string' ? this.port2num[port] : port;
    // @ts-ignore
    const buf = Buffer.from([0x09, 0x00, 0x81, portNum, 0x11, 0x07, 0x00, 0x64, 0x03]);
    //buf.writeUInt16LE(seconds * 1000, 6);
    buf.writeInt8(dutyCycle, 6);
    return buf;
  }

  //0x0C, 0x00, 0x81, port, 0x11, 0x09, 0x00, 0x00, 0x00, 0x64, 0x7F, 0x03

  /**
   * Control the LED on the Move Hub
   * @method Hub#led
   * @param {boolean|number|string} color
   * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
   * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
   * `white`
   * @param {function} [callback]
   */
  led(color: string | number | boolean, callback?: () => void) {
    this.write(this.encodeLed(color), callback);
  }

  /**
   * Subscribe for sensor notifications
   * @param {string|number} port - e.g. call `.subscribe('C')` if you have your distance/color sensor on port C.
   * @param {number} [option=0] Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
   * @param {function} [callback]
   */
  subscribe(port: string | number, option: number = 0, callback?: () => void) {
    if (typeof option === 'function') {
      // TODO: Why we have function check here?
      callback = option;
      option = 0x00;
    }
    const portNum = typeof port === 'string' ? this.port2num[port] : port;
    this.write(
      // @ts-ignore
      Buffer.from([0x0a, 0x00, 0x41, portNum, option, 0x01, 0x00, 0x00, 0x00, 0x01]),
      callback
    );
  }

  /**
   * Unsubscribe from sensor notifications
   * @param {string|number} port
   * @param {number} [option=0] Unknown meaning. Needs to be 0 for distance/color, 2 for motors, 8 for tilt
   * @param {function} [callback]
   */
  unsubscribe(port: string | number, option: number = 0, callback: () => void) {
    if (typeof option === 'function') {
      callback = option;
      option = 0x00;
    }
    const portNum = typeof port === 'string' ? this.port2num[port] : port;
    this.write(
      // @ts-ignore
      Buffer.from([0x0a, 0x00, 0x41, portNum, option, 0x01, 0x00, 0x00, 0x00, 0x00]),
      callback
    );
  }

  subscribeAll() {
    Object.entries(this.ports).forEach(([port, data]) => {
      if (data.deviceType === 'DISTANCE') {
        this.subscribe(parseInt(port, 10), 8);
      } else if (data.deviceType === 'TILT') {
        this.subscribe(parseInt(port, 10), 0);
      } else if (data.deviceType === 'IMOTOR') {
        this.subscribe(parseInt(port, 10), 2);
      } else if (data.deviceType === 'MOTOR') {
        this.subscribe(parseInt(port, 10), 2);
      } else {
        this.logDebug(`Port subscribtion not sent: ${port}`);
      }
    });
  }

  /**
   * Send data over BLE
   * @method Hub#write
   * @param {string|Buffer} data If a string is given it has to have hex bytes separated by spaces, e.g. `0a 01 c3 b2`
   * @param {function} callback
   */
  write(data: any, callback?: () => void) {
    if (typeof data === 'string') {
      const arr = [];
      data.split(' ').forEach(c => {
        arr.push(parseInt(c, 16));
      });
      // @ts-ignore
      data = Buffer.from(arr);
    }

    // Original implementation passed secondArg to define if response is waited
    this.writeCue.push({
      data,
      secondArg: true,
      callback,
    });

    this.writeFromCue();
  }

  writeFromCue() {
    if (this.writeCue.length === 0 || this.isWriting) return;

    const el: any = this.writeCue.shift();
    this.logDebug('Writing to device', el);
    this.isWriting = true;
    this.characteristic
      .writeValue(el.data)
      .then(() => {
        this.isWriting = false;
        if (typeof el.callback === 'function') el.callback();
      })
      .catch(err => {
        this.isWriting = false;
        this.log(`Error while writing: ${el.data} - Error ${err.toString()}`);
        // TODO: Notify of failure
      })
      .finally(() => {
        this.writeFromCue();
      });
  }

  encodeMotorTimeMulti(port: number, seconds: number, dutyCycleA = 100, dutyCycleB = -100) {
    // @ts-ignore
    const buf = Buffer.from([0x0d, 0x00, 0x81, port, 0x11, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
    buf.writeUInt16LE(seconds * 1000, 6);
    buf.writeInt8(dutyCycleA, 8);
    buf.writeInt8(dutyCycleB, 9);
    return buf;
  }

  encodeMotorTime(port: number, seconds: number, dutyCycle = 100) {
    // @ts-ignore
    const buf = Buffer.from([0x0c, 0x00, 0x81, port, 0x11, 0x09, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
    buf.writeUInt16LE(seconds * 1000, 6);
    buf.writeInt8(dutyCycle, 8);
    return buf;
  }

  encodeMotorAngleMulti(port: number, angle: number, dutyCycleA = 100, dutyCycleB = -100) {
    // @ts-ignore
    const buf = Buffer.from([0x0f, 0x00, 0x81, port, 0x11, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
    buf.writeUInt32LE(angle, 6);
    buf.writeInt8(dutyCycleA, 10);
    buf.writeInt8(dutyCycleB, 11);
    return buf;
  }

  encodeMotorAngle(port: number, angle: number, dutyCycle = 100) {
    // @ts-ignore
    const buf = Buffer.from([0x0e, 0x00, 0x81, port, 0x11, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x7f, 0x03]);
    buf.writeUInt32LE(angle, 6);
    buf.writeInt8(dutyCycle, 10);
    return buf;
  }

  encodeLed(color: string | number | boolean) {
    if (typeof color === 'boolean') {
      color = color ? 'white' : 'off';
    }
    const colorNum = typeof color === 'string' ? this.ledColors.indexOf(color as LedColor) : color;
    // @ts-ignore
    return Buffer.from([0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, colorNum]);
  }
}
