export class BoostConnector {
  public static async connect() : Promise<BluetoothRemoteGATTCharacteristic> {
  
    const boostHubPrimaryServiceUuid = '00001623-1212-efde-1623-785feabcd123';

    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [boostHubPrimaryServiceUuid]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(boostHubPrimaryServiceUuid);
    const characteristics = await service.getCharacteristics();
    return characteristics[0];
  }
}