const BOOST_HUB_SERVICE_UUID = "00001623-1212-efde-1623-785feabcd123";
const BOOST_CHARACTERISTIC_UUID = "00001624-1212-efde-1623-785feabcd123";

export class BoostConnector {
  public static async connect(): Promise<BluetoothRemoteGATTCharacteristic> {
    const options = {
      acceptAllDevices: false,
      filters: [{ services: [BOOST_HUB_SERVICE_UUID] }],
      optionalServices: [BOOST_HUB_SERVICE_UUID]
    };

    const device = await navigator.bluetooth.requestDevice(options);

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(BOOST_HUB_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(BOOST_CHARACTERISTIC_UUID);
    await characteristic.startNotifications();

    return characteristic;
  }
}