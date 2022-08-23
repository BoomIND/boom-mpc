/// <reference types="node" />
import { BigInt } from "../common";
import { eddsa as EdDSA } from 'elliptic';
interface KeyPair {
    public_key: Ed25519Point;
    expanded_private_key: ExpandedPrivateKey;
}
interface ExpandedPrivateKey {
    prefix: Ed25519Scalar;
    private_key: Ed25519Scalar;
}
interface KeyAgg {
    apk: Ed25519Point;
    hash: Ed25519Scalar;
}
export declare class Ed25519Party2Share {
    private key_pair;
    private agg_pub_key;
    private id;
    constructor(key_pair: KeyPair, agg_pub_key: KeyAgg, id: string);
    getKeyPair(): KeyPair;
    getAggregatedPublicKey(): KeyAgg;
    getId(): string;
    getPublicKey(): EdDSA.Point;
    static fromPlain(plain: any): Ed25519Party2Share;
}
export declare class Ed25519Signature {
    R: Ed25519Point;
    s: Ed25519Scalar;
    constructor(R: Ed25519Point, s: Ed25519Scalar);
    static fromPlain(plain: any): Ed25519Signature;
    toBuffer(): Buffer;
}
declare type Ed25519Scalar = BigInt;
interface Ed25519Point {
    bytes_str: BigInt;
}
export declare class Ed25519Party2 {
    private party1Endpoint;
    constructor(party1Endpoint: string);
    generateKey(): Promise<Ed25519Party2Share>;
    sign(msgHash: Buffer, share: Ed25519Party2Share): Promise<Ed25519Signature>;
}
export {};
