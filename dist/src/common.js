"use strict";
exports.__esModule = true;
exports.toLittleEndian = exports.stringifyHex = exports.FE_BYTES_SIZE = void 0;
exports.FE_BYTES_SIZE = 32;
function stringifyHex(n) {
    return JSON.stringify(n.toString(16));
}
exports.stringifyHex = stringifyHex;
function toLittleEndian(buffer) {
    if (buffer.length < 1) {
        return buffer;
    }
    var j = buffer.length - 1;
    var tmp = 0;
    for (var i = 0; i < buffer.length / 2; i++) {
        tmp = buffer[i];
        buffer[i] = buffer[j];
        buffer[j] = tmp;
        j--;
    }
    return buffer;
}
exports.toLittleEndian = toLittleEndian;
