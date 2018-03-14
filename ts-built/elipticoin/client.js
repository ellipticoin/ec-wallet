"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const request = require("request-promise");
const _ = require("lodash");
const ed25519 = require('ed25519');
const cbor = require("cbor");
const nacl = require("tweetnacl");
const fs = require("fs");
const yaml = require("js-yaml");
class Client {
    constructor({ privateKey }) {
        this.privateKey = privateKey;
        this.publicKey = new Buffer(nacl.sign.keyPair.fromSecretKey(this.privateKey).publicKey);
        this.nonce = 0;
    }
    static fromConfig() {
        const privateKey = new Buffer(yaml.safeLoad(fs.readFileSync(constants_1.CONFIG_PATH)).privateKey, "base64");
        return new this({ privateKey });
    }
    edgeServer() {
        // Once we go live we'll ask the seed servers for their peers
        // and call a list of edge nodes round-robin.
        // For now just send transactions directly to the seed nodes
        return _.sample(constants_1.ELIPITCOIN_SEED_EDGE_SERVERS);
    }
    async resolveAddress(address) {
        if (address && address.endsWith("=")) {
            return new Buffer(address, "base64");
        }
        else if (address) {
            return this.call({
                method: "lookup",
                params: [utils_1.humanReadableAddressToU32Bytes(address)]
            });
        }
        else {
            return this.call({
                method: "lookup",
                params: [utils_1.humanReadableAddressToU32Bytes(this.publicKey)]
            });
        }
    }
    call({ method, params = [], }) {
        const rpc_call = cbor.encode({
            method,
            params,
        });
        const nonce = utils_1.toBytesInt32(this.nonce++);
        const message = Buffer.concat([
            this.publicKey,
            nonce,
            constants_1.BASE_CONTRACT_ADDRESS,
            rpc_call,
        ]);
        const body = Buffer.concat([
            ed25519.Sign(message, this.privateKey),
            message
        ]);
        return request({
            url: this.edgeServer(),
            method: "POST",
            encoding: null,
            body,
        }).then((result) => {
            if (result.length) {
                return cbor.decode(result);
            }
        });
    }
}
exports.default = Client;
