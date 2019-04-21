/// <reference types="web-bluetooth" />
export declare class BoostConnector {
    private static device;
    static connect(disconnectCallback: () => Promise<void>): Promise<BluetoothRemoteGATTCharacteristic>;
    private static getCharacteristic;
    static reconnect(): Promise<[boolean, BluetoothRemoteGATTCharacteristic]>;
    static disconnect(): Promise<boolean>;
}
//# sourceMappingURL=boostConnector.d.ts.map