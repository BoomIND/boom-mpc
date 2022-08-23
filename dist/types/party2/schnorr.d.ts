/// <reference types="node" />
import { GE, FE } from "../common";
import { curve } from 'elliptic';
interface ShamirSecretSharing {
    threshold: number;
    share_count: number;
}
interface SharedKey {
    y: GE;
    x_i: FE;
}
interface VerifiableVss {
    parameters: ShamirSecretSharing;
    commitments: GE[];
}
export declare class SchnorrParty2Share {
    id: string;
    private shared_key;
    private vss_scheme_vec;
    constructor(id: string, shared_key: SharedKey, vss_scheme_vec: VerifiableVss[]);
    static fromPlain(plain: any): SchnorrParty2Share;
    getPublicKey(): curve.base.BasePoint;
}
export declare class SchnorrSignature {
    e: FE;
    s: FE;
    constructor(e: FE, s: FE);
    static fromPlain(plain: any): SchnorrSignature;
    toBuffer(): Buffer;
}
export declare class SchnorrParty2 {
    private party1Endpoint;
    constructor(party1Endpoint: string);
    generateKey(): Promise<SchnorrParty2Share>;
    sign(msgHash: Buffer, share: SchnorrParty2Share): Promise<SchnorrSignature>;
}
export {};
