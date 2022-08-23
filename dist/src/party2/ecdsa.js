"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EcdsaParty2 = exports.EcdsaSignature = exports.EcdsaParty2Share = void 0;
var bindings = require("../bindings");
var elliptic_1 = require("elliptic");
var common_1 = require("../common");
var CURVE = "secp256k1";
var ec = new elliptic_1.ec(CURVE);
var EcdsaParty2Share = /** @class */ (function () {
    function EcdsaParty2Share(p1MasterKeyId, p2MasterKey) {
        this.id = p1MasterKeyId;
        this.master_key = p2MasterKey;
    }
    EcdsaParty2Share.fromPlain = function (plain) {
        return new EcdsaParty2Share(plain.id, plain.master_key);
    };
    EcdsaParty2Share.prototype.getPublicKey = function () {
        var pub = {
            x: this.master_key.public.q.x.toString(),
            y: this.master_key.public.q.y.toString()
        };
        var keyPair = ec.keyFromPublic(pub);
        return keyPair.getPublic();
    };
    return EcdsaParty2Share;
}());
exports.EcdsaParty2Share = EcdsaParty2Share;
var EcdsaSignature = /** @class */ (function () {
    function EcdsaSignature(r, s, recid) {
        this.r = r;
        this.s = s;
        this.recid = recid;
    }
    EcdsaSignature.fromPlain = function (plain) {
        return new EcdsaSignature(plain.r, plain.s, plain.recid);
    };
    EcdsaSignature.prototype.toBuffer = function () {
        var signatureBuf = Buffer.allocUnsafe(64);
        Buffer.from(this.r.padStart(common_1.FE_BYTES_SIZE * 2, "0"), "hex").copy(signatureBuf, 0);
        Buffer.from(this.s.padStart(common_1.FE_BYTES_SIZE * 2, "0"), "hex").copy(signatureBuf, 32);
        return signatureBuf;
    };
    return EcdsaSignature;
}());
exports.EcdsaSignature = EcdsaSignature;
var EcdsaParty2 = /** @class */ (function () {
    function EcdsaParty2(party1Endpoint) {
        this.party1Endpoint = party1Endpoint;
    }
    EcdsaParty2.prototype.generateMasterKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rsp, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rsp = bindings.p2_ecdsa_generate_master_key(this.party1Endpoint);
                        return [4 /*yield*/, rsp];
                    case 1:
                        rsp = _a.sent();
                        res = JSON.parse(rsp);
                        return [2 /*return*/, EcdsaParty2Share.fromPlain(res)];
                }
            });
        });
    };
    EcdsaParty2.prototype.getChildShare = function (p2MasterKeyShare, xPos, yPos) {
        var res = JSON.parse(bindings.p2_ecdsa_get_child_share(JSON.stringify(p2MasterKeyShare), (0, common_1.stringifyHex)(xPos), (0, common_1.stringifyHex)(yPos)));
        return EcdsaParty2Share.fromPlain(res);
    };
    EcdsaParty2.prototype.sign = function (msgHash, childPartyTwoShare, xPos, yPos) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, bindings.p2_ecdsa_sign(this.party1Endpoint, JSON.stringify(msgHash), JSON.stringify(childPartyTwoShare), (0, common_1.stringifyHex)(xPos), (0, common_1.stringifyHex)(yPos))];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/, EcdsaSignature.fromPlain(JSON.parse(res))];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return EcdsaParty2;
}());
exports.EcdsaParty2 = EcdsaParty2;
