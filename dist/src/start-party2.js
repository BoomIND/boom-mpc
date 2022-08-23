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
var _a, _b;
exports.__esModule = true;
var _1 = require(".");
var express_1 = __importDefault(require("express"));
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3005;
var P1_ENDPOINT = (_b = process.env.P1_ENDPOINT) !== null && _b !== void 0 ? _b : "http://localhost:8000";
var party2ChildShare, party2;
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var party2MasterKeyShare, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Initializing...");
                party2 = new _1.EcdsaParty2(P1_ENDPOINT);
                return [4 /*yield*/, party2.generateMasterKey()];
            case 1:
                party2MasterKeyShare = _a.sent();
                party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
                console.log(party2ChildShare.getPublicKey().encode("hex", false));
                console.log("Initialized...");
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("init error", error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
function generateTwoPartyEcdsaSignature(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("hash", msg);
                    return [4 /*yield*/, party2.sign(msg, party2ChildShare, 0, 0)];
                case 1:
                    signature = _a.sent();
                    console.log(JSON.stringify(signature));
                    return [2 /*return*/, signature];
            }
        });
    });
}
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = req.body.msg;
                return [4 /*yield*/, generateTwoPartyEcdsaSignature(msg)];
            case 1:
                signature = _a.sent();
                res.json(signature);
                return [2 /*return*/];
        }
    });
}); });
init();
app.listen(PORT, function () {
    console.log("MPC party 2 server listening on port ".concat(PORT));
});
