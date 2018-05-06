"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigNumber = require('bignumber.js');
const { WORDS_FILE_PATH } = require("./constants");
const fs = require("fs");
const ADDRESS_REGEXP = /\w+\w+-\d+/;
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
function formatBalance(balance) {
    return new BigNumber(balance).div(10000).toFixed(4);
}
exports.formatBalance = formatBalance;
function humanReadableAddressToU32Bytes(address) {
    let identifiers = address.split("-").reverse();
    let words = readWords();
    let int32Address = parseInt(identifiers[0]) << 22 |
        words.indexOf(identifiers[1]) << 11 |
        words.indexOf(identifiers[2]);
    return new Buffer(toBytesInt32(int32Address));
}
exports.humanReadableAddressToU32Bytes = humanReadableAddressToU32Bytes;
function humanReadableAddress(address) {
    let int32Address = fromBytesInt32(address.slice(0, 4));
    let words = readWords();
    let identifiers = [];
    identifiers[0] = int32Address >> 22 & 1023;
    identifiers[1] = int32Address >> 11 & 2047;
    identifiers[2] = int32Address & 2047;
    return [
        words[identifiers[2]],
        words[identifiers[1]],
        identifiers[0]
    ].join("-");
}
exports.humanReadableAddress = humanReadableAddress;
async function coerceArgs(client, args) {
    return Promise.all(args.map(async (arg) => {
        if (arg.match(ADDRESS_REGEXP)) {
            return await client.resolveAddress(arg);
        }
        else {
            return JSON.parse(arg);
        }
    }));
}
exports.coerceArgs = coerceArgs;
function readWords() {
    return fs
        .readFileSync(WORDS_FILE_PATH, "utf8")
        .split("\n");
}
