"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Contract {
    constructor(client, contractAddress, contractName) {
        this.client = client;
        this.contractAddress = contractAddress;
        this.contractName = contractName;
    }
    get(method, ...params) {
        return this.client.post(this.contractAddress, this.contractName, method, params);
    }
    post(method, ...params) {
        return this.client.post(this.contractAddress, this.contractName, method, params);
    }
}
exports.default = Contract;
