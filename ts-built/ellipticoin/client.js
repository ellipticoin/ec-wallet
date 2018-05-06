"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const libsodium = require('libsodium-wrappers-sumo');
const fetch = require("node-fetch");
const _ = require("lodash");
const ed25519 = require('ed25519');
const cbor = require("borc");
const nacl = require("tweetnacl");
const fs = require("fs");
const yaml = require("js-yaml");
class Client {
    constructor({ privateKey }) {
        this.privateKey = privateKey;
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
            return this.post(constants_1.BASE_CONTRACT_ADDRESS, "HumanReadableNameRegistery", "lookup", [utils_1.humanReadableAddressToU32Bytes(address)]);
        }
        else {
            return await this.publicKey();
        }
    }
    async sign(message) {
        await libsodium.ready;
        return libsodium.crypto_sign_detached(message, this.privateKey);
    }
    async publicKey() {
        await libsodium.ready;
        return new Buffer(libsodium.crypto_sign_ed25519_sk_to_pk(this.privateKey));
    }
    async deploy(contractName, contractCode, params) {
        const path = "/" + [
            (await this.publicKey()).toString("hex"),
            contractName,
        ].join("/");
        let body = cbor.encode({
            code: contractCode,
            params,
        });
        let nonce = new Buffer(utils_1.toBytesInt32(this.nonce++));
        let message = Buffer.concat([new Buffer(path, "utf8"), body, nonce]);
        let signature = new Buffer(await this.sign(message));
        return fetch(this.edgeServer() + path, {
            method: "PUT",
            body,
            headers: {
                "Content-Type": "application/cbor",
                "Authorization": [
                    "Signature",
                    (await this.publicKey()).toString("hex"),
                    signature.toString("hex"),
                    nonce.toString("hex"),
                ].join(" ")
            }
        }).then(async (response) => {
            let arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength) {
                return cbor.decode(Buffer.from(arrayBuffer));
            }
        }).catch((error) => {
            if (error.response) {
                throw `Contract error: ${error.response.body.toString()}`;
            }
            else {
                throw error;
            }
        });
    }
    async post(contractAddress, contractName, method, params = []) {
        const body = cbor.encode({
            method,
            params,
        });
        const path = "/" + [
            contractAddress.toString("hex"),
            contractName,
        ].join("/");
        let nonce = new Buffer(utils_1.toBytesInt32(this.nonce++));
        let message = Buffer.concat([new Buffer(path, "utf8"), body, nonce]);
        let signature = new Buffer(await this.sign(message));
        return fetch(this.edgeServer() + path, {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/cbor",
                "Authorization": [
                    "Signature",
                    (await this.publicKey()).toString("hex"),
                    signature.toString("hex"),
                    nonce.toString("hex"),
                ].join(" ")
            }
        }).then(async (response) => {
            if (response.status == 500) {
                throw await response.text();
            }
            ;
            let arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength) {
                return cbor.decode(Buffer.from(arrayBuffer));
            }
        }).catch((error) => {
            throw `Contract error: ${error}`;
        });
    }
    async get(contractAddress, contractName, method, params = []) {
        const rpcCall = cbor.encode({
            method,
            params,
        });
        const path = "/" + [
            contractAddress.toString("hex"),
            contractName,
        ].join("/");
        let message = Buffer.concat([new Buffer(path, "utf8"), rpcCall]);
        let signature = new Buffer(await this.sign(message));
        let nonce = new Buffer(utils_1.toBytesInt32(this.nonce++));
        return fetch(this.edgeServer() + path + "?" + rpcCall.toString("hex")).then(async (response) => {
            let arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength) {
                return cbor.decode(Buffer.from(arrayBuffer));
            }
        }).catch((error) => {
            if (error.response) {
                throw `Contract error: ${error.response.body.toString()}`;
            }
            else {
                throw error;
            }
        });
    }
}
exports.default = Client;
