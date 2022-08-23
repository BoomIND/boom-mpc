import { BigInt, DecryptionKey, EncryptionKey, FE, GE } from "../common";
import { curve } from "elliptic";
import { Party1 } from "./base";
interface Party1Private {
    x1: FE;
    paillier_priv: DecryptionKey;
    c_key_randomness: BigInt;
}
interface Party1Public {
    q: GE;
    p1: GE;
    p2: GE;
    paillier_pub: EncryptionKey;
    c_key: BigInt;
}
export declare class EcdsaParty1Share {
    private public;
    private private;
    private chain_code;
    constructor(pub: Party1Public, priv: Party1Private, chainCode: BigInt);
    static fromPlain(plain: any): EcdsaParty1Share;
    getPublicKey(): curve.base.BasePoint;
}
export declare class EcdsaParty1 extends Party1 {
    constructor(rocksDbDir?: string);
    getMasterKey(masterKeyId: string): Promise<EcdsaParty1Share>;
    getChildShare(p1MasterKeyShare: EcdsaParty1Share, xPos: number, yPos: number): EcdsaParty1Share;
}
export {};
