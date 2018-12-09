/// <reference types="web-bluetooth" />
export declare class BoostConnector {
    private static device;
    static connect(): Promise<BluetoothRemoteGATTCharacteristic>;
    static reconnect(): Promise<boolean>;
    static disconnect(): Promise<boolean>;
}
//# sourceMappingURL=boostConnector.d.ts.map