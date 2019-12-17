"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
exports.CONFIG_DIR = `${exports.HOME}/.ec-wallet`;
exports.CONFIG_PATH = `${exports.CONFIG_DIR}/config.yaml`;
//# sourceMappingURL=constants.js.map