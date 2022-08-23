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
exports.Ed25519Party2 = exports.Ed25519Signature = exports.Ed25519Party2Share = void 0;
var path = require('path');
var bindings = require(path.join(__dirname, '../../../native'));
var common_1 = require("../common");
var util_1 = __importDefault(require("util"));
bindings.p2_eddsa_generate_key = util_1["default"].promisify(bindings.p2_eddsa_generate_key);
bindings.p2_eddsa_sign = util_1["default"].promisify(bindings.p2_eddsa_sign);
var SCALAR_BYTES_SIZE = 32;
var POINT_BYTES_SIZE = 32;
var elliptic_1 = require("elliptic");
var CURVE = 'ed25519';
var ec = new elliptic_1.eddsa(CURVE);
var Ed25519Party2Share = /** @class */ (function () {
    function Ed25519Party2Share(key_pair, agg_pub_key, id) {
        this.key_pair = key_pair;
        this.agg_pub_key = agg_pub_key;
        this.id = id;
    }
    Ed25519Party2Share.prototype.getKeyPair = function () {
        return this.key_pair;
    };
    Ed25519Party2Share.prototype.getAggregatedPublicKey = function () {
        return this.agg_pub_key;
    };
    Ed25519Party2Share.prototype.getId = function () {
        return this.id;
    };
    Ed25519Party2Share.prototype.getPublicKey = function () {
        var apkBytes = this.agg_pub_key.apk.bytes_str.padStart(POINT_BYTES_SIZE * 2, '0');
        return ec.decodePoint(apkBytes);
    };
    // expects a plain JS array as returned from the Rust bindings
    Ed25519Party2Share.fromPlain = function (plain) {
        return new Ed25519Party2Share(plain[0], plain[1], plain[2]);
    };
    return Ed25519Party2Share;
}());
exports.Ed25519Party2Share = Ed25519Party2Share;
var Ed25519Signature = /** @class */ (function () {
    function Ed25519Signature(R, s) {
        this.R = R;
        this.s = s;
    }
    Ed25519Signature.fromPlain = function (plain) {
        return new Ed25519Signature(plain.R, plain.s);
    };
    Ed25519Signature.prototype.toBuffer = function () {
        var RBuf = Buffer.from(this.R.bytes_str.padStart(POINT_BYTES_SIZE * 2, '0'), 'hex');
        var sBuf = Buffer.from(this.s.padStart(SCALAR_BYTES_SIZE * 2, '0'), 'hex');
        var sBufLE = (0, common_1.toLittleEndian)(sBuf);
        return Buffer.concat([RBuf, sBufLE], POINT_BYTES_SIZE + SCALAR_BYTES_SIZE);
    };
    return Ed25519Signature;
}());
exports.Ed25519Signature = Ed25519Signature;
var Ed25519Party2 = /** @class */ (function () {
    function Ed25519Party2(party1Endpoint) {
        this.party1Endpoint = party1Endpoint;
    }
    Ed25519Party2.prototype.generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, bindings.p2_eddsa_generate_key(this.party1Endpoint)];
                    case 1:
                        res = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, Ed25519Party2Share.fromPlain(res)];
                }
            });
        });
    };
    Ed25519Party2.prototype.sign = function (msgHash, share) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, bindings.p2_eddsa_sign(this.party1Endpoint, JSON.stringify(msgHash.toString('hex')), JSON.stringify(share.getKeyPair()), JSON.stringify(share.getAggregatedPublicKey()), share.getId())];
                    case 1:
                        res = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, Ed25519Signature.fromPlain(res)];
                }
            });
        });
    };
    return Ed25519Party2;
}());
exports.Ed25519Party2 = Ed25519Party2;
