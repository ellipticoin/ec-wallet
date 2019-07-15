"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_1 = require("./contract");
const utils_1 = require("../utils");
const BALANCE_KEY = new Buffer([0]);
class TokenContract extends contract_1.default {
    async balanceOf(address) {
        let balanceBytes = await this.getMemory(Buffer.concat([BALANCE_KEY, address]));
        if (balanceBytes) {
            return utils_1.bytesToNumber(balanceBytes);
        }
        else {
            return 0;
        }
    }
}
exports.default = TokenContract;
//# sourceMappingURL=token_contract.js.map