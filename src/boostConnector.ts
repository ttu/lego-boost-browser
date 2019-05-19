const BOOST_HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
const BOOST_CHARACTERISTIC_UUID = '00001624-1212-efde-1623-785feabcd123';

export class BoostConnector {
  private static device: BluetoothDevice;

  public static isWebBluetoothSupported : boolean =  navigator.bluetooth ? true : false;
  
  public static async connect(disconnectCallback: () => Promise<void>): Promise<BluetoothRemoteGATTCharacteristic> {
    const options = {
      acceptAllDevices: false,
      filters: [{ services: [BOOST_HUB_SERVICE_UUID] }],
      optionalServices: [BOOST_HUB_SERVICE_UUID],
    };

    this.device = await navigator.bluetooth.requestDevice(options);

    this.device.addEventListener('gattserverdisconnected', async event => {
      await disconnectCallback();
    });

    // await this.device.watchAdvertisements();

    // this.device.addEventListener('advertisementreceived', event => {
    //   // @ts-ignore
    //   console.log(event.rssi);
    // });

    return BoostConnector.getCharacteristic(this.device);
  }

  private static async getCharacteristic(device: BluetoothDevice): Promise<BluetoothRemoteGATTCharacteristic> {
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(BOOST_HUB_SERVICE_UUID);
    return await service.getCharacteristic(BOOST_CHARACTERISTIC_UUID);
  }

  public static async reconnect(): Promise<[boolean, BluetoothRemoteGATTCharacteristic]> {
    if (this.device) {
      const char = await BoostConnector.getCharacteristic(this.device);
      return [true, char];
    }
    return [false, null];
  }

  public static async disconnect(): Promise<boolean> {
    if (this.device) {
      await this.device.gatt.disconnect();
      return true;
    }
    return false;
  }
}
