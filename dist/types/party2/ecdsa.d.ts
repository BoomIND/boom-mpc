/// <reference types="node" />
import { curve } from "elliptic";
import { BigInt, EncryptionKey, FE, GE } from "../common";
interface Party2Private {
    x2: FE;
}
interface Party2Public {
    q: GE;
    p2: GE;
    p1: GE;
    paillier_pub: EncryptionKey;
    c_key: BigInt;
}
interface Party2MasterKey {
    public: Party2Public;
    private: Party2Private;
    chain_code: BigInt;
}
export declare class EcdsaParty2Share {
    id: string;
    private master_key;
    constructor(p1MasterKeyId: string, p2MasterKey: Party2MasterKey);
    static fromPlain(plain: any): EcdsaParty2Share;
    getPublicKey(): curve.base.BasePoint;
}
export declare class EcdsaSignature {
    r: BigInt;
    s: BigInt;
    recid: number;
    constructor(r: BigInt, s: BigInt, recid: number);
    static fromPlain(plain: any): EcdsaSignature;
    toBuffer(): Buffer;
}
export declare class EcdsaParty2 {
    private party1Endpoint;
    constructor(party1Endpoint: string);
    generateMasterKey(): Promise<EcdsaParty2Share>;
    getChildShare(p2MasterKeyShare: EcdsaParty2Share, xPos: number, yPos: number): EcdsaParty2Share;
    sign(msgHash: string, childPartyTwoShare: EcdsaParty2Share, xPos: number, yPos: number): Promise<EcdsaSignature | undefined>;
}
export {};
