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
const ora_1 = require("ora");
const constants_1 = require("../constants");
const base64url = require("base64url").default;
const base64urlToBuffer = require("base64url").toBuffer;
let default_1 = class default_1 extends clime_1.Command {
    async execute(token, amount, address, contractName, func, args) {
        const client = ec_client_1.Client.fromConfig(constants_1.CONFIG_PATH);
        const addressBuffer = base64urlToBuffer(address);
        const tokenContract = ec_client_1.tokenContractFromString(token);
        tokenContract.setClient(client);
        const spinner = ora_1.default("Waiting for transaction to be mined").start();
        let transaction = await tokenContract.approve(addressBuffer, amount * 10000);
        let completedTransaction = await client.waitForTransactionToBeMined(transaction);
        if (completedTransaction.return_code == 0) {
            spinner.succeed(`Approved transfer: ${base64url(ec_client_1.objectHash(transaction))}`);
        }
        else {
            spinner.fail(`Smart contract error: ${completedTransaction.return_value}`);
        }
        console.log("Posting Transaction");
        console.log("===================");
        console.log(`Contract Created By: ${address}`);
        console.log(`Contract Name: ${contractName}`);
        console.log(`Function: ${func}`);
        console.log(`Arguments: [\n  ${args.join(",\n  ")}\n]`);
        const contract = new ec_client_1.Contract(addressBuffer, contractName);
        transaction = contract.createTransaction(func, ...(await ec_client_1.coerceArgs(client, args)));
        spinner.start();
        const postedTransaction = await client.post(transaction);
        completedTransaction = await client.waitForTransactionToBeMined(postedTransaction);
        if (completedTransaction.return_code == 0) {
            spinner.succeed(`Mined transaction: ${base64url(ec_client_1.objectHash(transaction))}`);
        }
        else {
            spinner.fail(`Smart contract error: ${completedTransaction.return_value}`);
        }
    }
};
__decorate([
    __param(0, clime_1.param({
        type: String,
        description: "Token",
        required: true,
    })),
    __param(1, clime_1.param({
        type: String,
        description: "Amount",
        required: true,
    })),
    __param(2, clime_1.param({
        description: "Address",
        required: true,
    })),
    __param(3, clime_1.param({
        description: "Contract",
        required: true,
    })),
    __param(4, clime_1.param({
        description: "Function Name",
        required: true,
    })),
    __param(5, clime_1.params({
        type: String,
        description: "Function Parameters",
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String, Array]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Call a state-modifying smart contract function",
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=post_with_payment.js.map