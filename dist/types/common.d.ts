/// <reference types="node" />
export declare type BigInt = string;
export declare type FE = BigInt;
export declare const FE_BYTES_SIZE = 32;
export declare function stringifyHex(n: number): string;
export interface GE {
    x: BigInt;
    y: BigInt;
}
export interface DecryptionKey {
    p: BigInt;
    q: BigInt;
}
export interface EncryptionKey {
    n: BigInt;
}
export declare function toLittleEndian(buffer: Buffer): Buffer;
