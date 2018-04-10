"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Contract {
    constructor(client, contractAddress, contractName) {
        this.client = client;
        this.contractAddress = contractAddress;
        this.contractName = contractName;
    }
    post(method, ...params) {
        return this.client.post(this.contractAddress, this.contractName, method, params);
    }
}
function ContractProxy(client, contractAddress, contractName) {
    let contract = new Contract(client, contractAddress, contractName);
    return new Proxy(contract, {
        get: function (receiver, name) {
            // console.log(arguments)
            return receiver.post.bind(receiver, _.snakeCase(name));
        }
    });
}
exports.default = ContractProxy;
