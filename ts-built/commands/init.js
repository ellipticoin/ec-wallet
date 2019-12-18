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
const crypto = require("crypto");
const libsodium = require("libsodium-wrappers-sumo");
const fs = require("fs");
const promiseRetry = require("promise-retry");
const { BASE_CONTRACT_ADDRESS, CONFIG_DIR, CONFIG_PATH } = require("../constants");
const { humanReadableAddress, fromBytesInt32 } = require("../utils");
const humanReadableNameRegistery = new Contract(null, BASE_CONTRACT_ADDRESS, "HumanReadableNameRegistery");
const baseToken = new Contract(null, BASE_CONTRACT_ADDRESS, "BaseToken");
let default_1 = class default_1 extends clime_1.Command {
    async execute() {
        const seed = crypto.randomBytes(32);
        await libsodium.ready;
        const { publicKey, privateKey } = libsodium.crypto_sign_keypair();
        mkdirp(CONFIG_DIR);
        fs.writeFileSync(CONFIG_PATH, yaml.safeDump({
            privateKey: Buffer.from(privateKey).toString("base64")
        }));
        return `Initialization done. Your elipticoin address is ${Buffer.from(publicKey).toString("base64")}`;
    }
};
__decorate([
    clime_1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    clime_1.command({
        description: "Generate an ec-wallet configuration file"
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=init.js.map