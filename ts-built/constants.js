"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.BASE_CONTRACT_ADDRESS = new Buffer("0000000000000000000000000000000000000000000000000000000000000000", "hex");
exports.BASE_CONTRACT_NAME = "BaseToken";
exports.PRIVATE_KEY = new Buffer("2a185960faf3ffa84ff8886e8e2e0f8ba0fff4b91adad23108bfef5204390483b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
exports.PUBLIC_KEY = new Buffer("b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
// export const ELIPITCOIN_SEED_EDGE_SERVERS = ["http://localhost:4460"]
exports.ELIPITCOIN_SEED_EDGE_SERVERS = ["https://davenport.ellipticoin.org:4460"];
exports.HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
exports.CONFIG_DIR = `${exports.HOME}/.ec-wallet`;
exports.CONFIG_PATH = `${exports.CONFIG_DIR}/config.yaml`;
exports.WORDS_FILE_PATH = path.resolve(__dirname, "..", "config", "english.txt");
//# sourceMappingURL=constants.js.map