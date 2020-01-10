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
const fs = require("fs");
const { humanReadableAddress, coerceArgs, fromBytesInt32 } = require("../utils");
const ora = require("ora");
const base64urlToBuffer = require("base64url").toBuffer;
let default_1 = class default_1 extends clime_1.Command {
    async execute(address, contractName, keyString) {
        const client = ec_client_1.Client.fromConfig(constants_1.CONFIG_PATH);
        const addressBuffer = base64urlToBuffer(address);
        const key = new Buffer(keyString, "base64");
        return await client.getMemory(addressBuffer, contractName, key);
    }
};
__decorate([
    __param(0, clime_1.param({
        description: "Address",
        required: true
    })),
    __param(1, clime_1.param({
        description: "Contract",
        required: true
    })),
    __param(2, clime_1.param({
        description: "key",
        required: true
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Call a state-modifying smart contract function"
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=get.js.map