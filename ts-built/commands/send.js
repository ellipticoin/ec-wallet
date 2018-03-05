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
const protobufjs_1 = require("protobufjs");
const clime_1 = require("clime");
const ed25519 = require('ed25519');
const PRIVATE_KEY = new Buffer("2a185960faf3ffa84ff8886e8e2e0f8ba0fff4b91adad23108bfef5204390483b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
const PUBLIC_KEY = new Buffer("b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
let default_1 = class default_1 extends clime_1.Command {
    execute(amount, receiver) {
        return protobufjs_1.load("src/protos.json").then(function (root) {
            const TransferArgs = root.lookupType("elipticoin.TransferArgs");
            const FuncAndArgs = root.lookupType("elipticoin.FuncAndArgs");
            const transferArgs = TransferArgs.create({
                amount: 1,
                receiverAddress: new Buffer(receiver, 'base64'),
            });
            var funcAndArgs = FuncAndArgs.create({
                func: "transfer",
                args: TransferArgs.encode(transferArgs).finish(),
                publicKey: PUBLIC_KEY,
            });
            const transfer = FuncAndArgs.encode(funcAndArgs).finish();
            var test = FuncAndArgs.create({
                func: "transfer",
                args: TransferArgs.encode(transferArgs).finish(),
                publicKey: PUBLIC_KEY,
                signature: ed25519.Sign(FuncAndArgs.encode(funcAndArgs).finish(), PRIVATE_KEY),
            });
            console.log(test.signature.toString('hex'));
            var funcAndArgsSigned = FuncAndArgs.encode(FuncAndArgs.create({
                func: "transfer",
                args: TransferArgs.encode(transferArgs).finish(),
                publicKey: PUBLIC_KEY,
                signature: ed25519.Sign(FuncAndArgs.encode(funcAndArgs).finish(), PRIVATE_KEY),
            })).finish();
            // console.log(FuncAndArgs.encode(funcAndArgs).finish().toString("hex"));
            console.log("---");
            console.log(ed25519.Sign(FuncAndArgs.encode(funcAndArgs).finish(), PRIVATE_KEY).toString('hex'));
            return funcAndArgsSigned.toString("hex");
        });
    }
};
__decorate([
    __param(0, clime_1.param({
        description: 'the amount of tokens you\'d like to send',
        required: true,
    })),
    __param(1, clime_1.param({
        description: 'the address you\'d like to send the tokens to',
        required: true,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: 'Send Elipticoins',
    })
], default_1);
exports.default = default_1;
