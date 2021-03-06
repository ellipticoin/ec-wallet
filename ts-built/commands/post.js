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
let default_1 = class default_1 extends clime_1.Command {
    async execute(address, contractName, func, args) {
        const client = ec_client_1.Client.fromConfig(constants_1.CONFIG_PATH);
        const addressBuffer = await this.client.resolveAddress(address);
        const transactionHash = await this.client.post(await this.client.publicKey(), contractName, func, await coerceArgs(this.client, args));
        console.log("Posting Transaction");
        console.log("===================");
        console.log(`Contract Created By: ${address}`);
        console.log(`Contract Name: ${contractName}`);
        console.log(`Function: ${func}`);
        console.log(`Arguments: [\n  ${args.join(",\n  ")}\n]`);
        const spinner = ora("Waiting for transaction to be mined").start();
        const transaction = await this.client.waitForTransactionToBeMined(transactionHash);
        if (transaction.return_code == 0) {
            spinner.succeed(`Mined ${transaction.hash.toString("base64")}`);
            if (transaction.return_value) {
                return `Return value ${transaction.return_value}`;
            }
        }
        else {
            spinner.fail(transaction.return_value);
        }
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
        description: "Function Name",
        required: true
    })),
    __param(3, clime_1.params({
        type: String,
        description: "Function Parameters"
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Call a state-modifying smart contract function"
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=post.js.map