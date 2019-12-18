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
const base64url_1 = require("base64url");
const clime_1 = require("clime");
const ec_client_1 = require("ec-client");
const ora_1 = require("ora");
const constants_1 = require("../constants");
const fs = require("fs");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let default_1 = class default_1 extends clime_1.Command {
    async execute(path, contractName, constructorParams) {
        console.log(`Deploying ${contractName}`);
        const spinner = ora_1.default("Waiting for transaction to be mined").start();
        const client = ec_client_1.Client.fromConfig(constants_1.CONFIG_PATH);
        const key = await client.publicKey();
        const transaction = await client.deploy(contractName, fs.readFileSync(path), await ec_client_1.coerceArgs(client, constructorParams));
        const completedTransaction = await client.waitForTransactionToBeMined(transaction);
        if (completedTransaction.return_code == 0) {
            spinner.succeed(`Deployed in transaction ${base64url_1.default(ec_client_1.transactionHash(completedTransaction))}`);
            return `Transaction address: ${base64url_1.default(ec_client_1.toAddress(Buffer.from(await client.publicKey()), contractName))}`;
        }
        else {
            spinner.fail(`Smart contract error: ${completedTransaction.return_value}`);
        }
    }
};
__decorate([
    __param(0, clime_1.param({
        description: "WASM file path",
        required: true
    })),
    __param(1, clime_1.param({
        description: "Contract name",
        required: true
    })),
    __param(2, clime_1.params({
        type: String,
        description: "Constructor Parameters"
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Deploy a Smart Contract"
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=deploy.js.map