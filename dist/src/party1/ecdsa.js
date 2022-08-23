"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.EcdsaParty1 = exports.EcdsaParty1Share = void 0;
var bindings_1 = require("../bindings");
var common_1 = require("../common");
var elliptic_1 = require("elliptic");
var base_1 = require("./base");
var CURVE = "secp256k1";
var ec = new elliptic_1.ec(CURVE);
var EcdsaParty1Share = /** @class */ (function () {
    function EcdsaParty1Share(pub, priv, chainCode) {
        this.public = pub;
        this.private = priv;
        this.chain_code = chainCode;
    }
    EcdsaParty1Share.fromPlain = function (plain) {
        return new EcdsaParty1Share(plain.public, plain.private, plain.chain_code);
    };
    EcdsaParty1Share.prototype.getPublicKey = function () {
        var pub = {
            x: this.public.q.x.toString(),
            y: this.public.q.y.toString()
        };
        var keyPair = ec.keyFromPublic(pub);
        return keyPair.getPublic();
    };
    return EcdsaParty1Share;
}());
exports.EcdsaParty1Share = EcdsaParty1Share;
var EcdsaParty1 = /** @class */ (function (_super) {
    __extends(EcdsaParty1, _super);
    function EcdsaParty1(rocksDbDir) {
        return _super.call(this, rocksDbDir) || this;
    }
    EcdsaParty1.prototype.getMasterKey = function (masterKeyId) {
        return __awaiter(this, void 0, void 0, function () {
            var searchString, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.getRocksDb()) {
                            throw new Error("RocksDB not initialized. The DB path should be passed in the constructor.");
                        }
                        searchString = "pass_through_guest_user_".concat(masterKeyId, "_Party1MasterKey");
                        return [4 /*yield*/, this.getRocksDb().open({ readOnly: true })];
                    case 1:
                        _c.sent();
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.getRocksDb().get(searchString, { asBuffer: false })];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    EcdsaParty1.prototype.getChildShare = function (p1MasterKeyShare, xPos, yPos) {
        var res = JSON.parse(bindings_1.bindings.p1_ecdsa_get_child_share(JSON.stringify(p1MasterKeyShare), (0, common_1.stringifyHex)(xPos), (0, common_1.stringifyHex)(yPos)));
        return EcdsaParty1Share.fromPlain(res);
    };
    return EcdsaParty1;
}(base_1.Party1));
exports.EcdsaParty1 = EcdsaParty1;
