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
    createTransaction(func, ...args) {
        return {
            contract_address: Buffer.concat([
                this.contractAddress,
                Buffer.from(this.contractName, "utf8")
            ]),
            function: func,
            arguments: args
        };
    }
    post(transaction) {
        return this.client.post(transaction);
    }
}
exports.default = Contract;
//# sourceMappingURL=contract.js.map