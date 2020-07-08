/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
declare const INSPECT_MAX_BYTES = 50;
declare const kMaxLength: number;
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */
declare function Buffer(arg: any, encodingOrOffset: any, length: any): any;
declare namespace Buffer {
    var TYPED_ARRAY_SUPPORT: boolean;
    var poolSize: number;
    var from: (value: any, encodingOrOffset: any, length: any) => any;
    var __proto__: Uint8ArrayConstructor;
    var alloc: (size: any, fill: any, encoding: any) => Uint8Array;
    var allocUnsafe: (size: any) => Uint8Array;
    var allocUnsafeSlow: (size: any) => Uint8Array;
    var isBuffer: (b: any) => boolean;
    var compare: (a: any, b: any) => 1 | -1 | 0;
    var isEncoding: (encoding: any) => boolean;
    var concat: (list: any, length: any) => Uint8Array;
    var byteLength: (string: any, encoding: any) => any;
}
declare function SlowBuffer(length: any): Uint8Array;
export { Buffer, SlowBuffer, INSPECT_MAX_BYTES, kMaxLength };
//# sourceMappingURL=buffer.d.ts.map