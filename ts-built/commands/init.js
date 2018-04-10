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
Object.defineProperty(exports, "__esModule", { value: true });
const clime_1 = require("clime");
const Contract = require("../ellipticoin/contract").default;
const Client = require("../ellipticoin/client").default;
const yaml = require("js-yaml");
const mkdirp = require("mkdirp");
const ed25519 = require("ed25519");
const crypto = require("crypto");
const fs = require("fs");
const promiseRetry = require('promise-retry');
const { BASE_CONTRACT_ADDRESS, BASE_CONTRACT_NAME, CONFIG_DIR, CONFIG_PATH, } = require("../constants");
const { humanReadableAddress, fromBytesInt32, } = require("../utils");
let default_1 = class default_1 extends clime_1.Command {
    execute() {
        return promiseRetry((retry, attemptNumber) => {
            const seed = crypto.randomBytes(32);
            const { publicKey, privateKey } = ed25519.MakeKeypair(seed);
            const client = new Client({ privateKey });
            const baseToken = new Contract(client, BASE_CONTRACT_ADDRESS, BASE_CONTRACT_NAME);
            baseToken.post("constructor", 100 * 10000).catch(retry);
            baseToken.post("register").catch(retry);
            return { publicKey, privateKey };
        }).then(({ publicKey, privateKey }) => {
            console.log(`Creating ${CONFIG_PATH}`);
            mkdirp(CONFIG_DIR);
            fs.writeFileSync(CONFIG_PATH, yaml.safeDump({
                privateKey: privateKey.toString("base64")
            }));
            return `Initialization done. Your elipticoin address is ${humanReadableAddress(publicKey)}`;
        });
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: 'Generate an ec-wallet configuration file',
    })
], default_1);
exports.default = default_1;
