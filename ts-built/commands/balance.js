"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const clime_1 = require("clime");
const ec_client_1 = require("ec-client");
const constants_1 = require("../constants");
const { toBytesInt32, humanReadableAddress, formatBalance } = require("../utils");
const cbor = require("cbor");
const nacl = require("tweetnacl");
let default_1 = class default_1 extends clime_1.Command {
    async execute(token, address) {
        const client = ec_client_1.Client.fromConfig(constants_1.CONFIG_PATH);
        const addressBuffer = new Buffer(address, "base64");
        const tokenContract = tokenContractFromString(token);
        tokenContract.setClient(client);
        const balance = await tokenContract.balanceOf(addressBuffer);
        return `Balance of ${addressBuffer.toString("base64")}\n${formatBalance(balance)}`;
    }
};
__decorate([
    __param(0, clime_1.param({
        description: "Token Contract Address/Ticker",
        required: true
    })),
    __param(1, clime_1.param({
        description: "Address",
        required: true
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Get account balances"
    })
], default_1);
exports.default = default_1;
function tokenContractFromString(tokenString) {
    const tokens = {
        EC: new ec_client_1.TokenContract(new Buffer(32), "System")
    };
    if (tokens[tokenString]) {
        return tokens[tokenString];
    }
    else {
        const [address, contractName] = tokenString.split(":");
        return new ec_client_1.TokenContract(new Buffer(address, "base64"), contractName);
    }
}
//# sourceMappingURL=balance.js.map