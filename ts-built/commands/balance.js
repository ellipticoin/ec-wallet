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
const constants_1 = require("../constants");
const client_1 = require("../ellipticoin/client");
const contract_1 = require("../ellipticoin/contract");
const { toBytesInt32, humanReadableAddress, formatBalance, } = require("../utils");
const request = require("request-promise");
const ed25519 = require('ed25519');
const cbor = require("cbor");
const nacl = require("tweetnacl");
let default_1 = class default_1 extends clime_1.Command {
    async execute(address) {
        const client = client_1.default.fromConfig();
        let addressBuffer = await client.resolveAddress(address);
        const baseToken = new contract_1.default(client, constants_1.BASE_CONTRACT_ADDRESS, constants_1.BASE_CONTRACT_NAME);
        let balance = await baseToken.get("balance_of", addressBuffer);
        return `Balance of ${humanReadableAddress(addressBuffer)}\n${formatBalance(balance)}`;
    }
};
__decorate([
    __param(0, clime_1.param({
        description: 'Address',
        required: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: 'Get account balances',
    })
], default_1);
exports.default = default_1;
