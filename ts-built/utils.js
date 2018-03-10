"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toBytesInt32(num) {
    var arr = new ArrayBuffer(4);
    var view = new DataView(arr);
    view.setUint32(0, num, true);
    return new Uint8Array(arr);
}
exports.toBytesInt32 = toBytesInt32;
function fromBytesInt32(buffer) {
    var arr = new ArrayBuffer(4);
    var view = new DataView(arr);
    buffer.forEach((value, index) => view.setUint8(index, value));
    return view.getUint32(0, true);
}
exports.fromBytesInt32 = fromBytesInt32;
