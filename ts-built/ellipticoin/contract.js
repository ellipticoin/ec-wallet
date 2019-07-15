"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Contract {
    constructor(contractAddress, contractName) {
        this.contractAddress = contractAddress;
        this.contractName = contractName;
    }
    setClient(client) {
        this.client = client;
    }
    getMemory(key) {
        return this.client.getMemory(this.contractAddress, this.contractName, key);
    }
    post(method, ...params) {
        return this.client.post(this.contractAddress, this.contractName, method, params);
    }
}
exports.default = Contract;
//# sourceMappingURL=contract.js.map