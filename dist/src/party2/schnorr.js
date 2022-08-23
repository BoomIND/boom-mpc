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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SchnorrParty2 = exports.SchnorrSignature = exports.SchnorrParty2Share = void 0;
var path = require('path');
var bindings = require(path.join(__dirname, '../../../native'));
var common_1 = require("../common");
var util_1 = __importDefault(require("util"));
bindings.p2_schnorr_generate_key = util_1["default"].promisify(bindings.p2_schnorr_generate_key);
bindings.p2_schnorr_sign = util_1["default"].promisify(bindings.p2_schnorr_sign);
var elliptic_1 = require("elliptic");
var CURVE = "secp256k1";
var ec = new elliptic_1.ec(CURVE);
var SchnorrParty2Share = /** @class */ (function () {
    function SchnorrParty2Share(id, shared_key, vss_scheme_vec) {
        this.id = id;
        this.shared_key = shared_key;
        this.vss_scheme_vec = vss_scheme_vec;
    }
    SchnorrParty2Share.fromPlain = function (plain) {
        return new SchnorrParty2Share(plain.id, plain.shared_key, plain.vss_scheme_vec);
    };
    SchnorrParty2Share.prototype.getPublicKey = function () {
        var pub = { x: this.shared_key.y.x.toString(), y: this.shared_key.y.y.toString() };
        var keyPair = ec.keyFromPublic(pub);
        return keyPair.getPublic();
    };
    return SchnorrParty2Share;
}());
exports.SchnorrParty2Share = SchnorrParty2Share;
var SchnorrSignature = /** @class */ (function () {
    function SchnorrSignature(e, s) {
        this.e = e;
        this.s = s;
    }
    SchnorrSignature.fromPlain = function (plain) {
        return new SchnorrSignature(plain.e, plain.s);
    };
    SchnorrSignature.prototype.toBuffer = function () {
        var signatureBuf = Buffer.allocUnsafe(64);
        Buffer.from(this.e.padStart(common_1.FE_BYTES_SIZE * 2, '0'), 'hex').copy(signatureBuf, 0);
        Buffer.from(this.s.padStart(common_1.FE_BYTES_SIZE * 2, '0'), 'hex').copy(signatureBuf, 32);
        return signatureBuf;
    };
    return SchnorrSignature;
}());
exports.SchnorrSignature = SchnorrSignature;
var SchnorrParty2 = /** @class */ (function () {
    function SchnorrParty2(party1Endpoint) {
        this.party1Endpoint = party1Endpoint;
    }
    SchnorrParty2.prototype.generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, bindings.p2_schnorr_generate_key(this.party1Endpoint)];
                    case 1:
                        res = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, SchnorrParty2Share.fromPlain(res)];
                }
            });
        });
    };
    SchnorrParty2.prototype.sign = function (msgHash, share) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, bindings.p2_schnorr_sign(this.party1Endpoint, JSON.stringify(msgHash.toString('hex')), JSON.stringify(share))];
                    case 1:
                        res = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, SchnorrSignature.fromPlain(res)];
                }
            });
        });
    };
    return SchnorrParty2;
}());
exports.SchnorrParty2 = SchnorrParty2;
