#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clime_1 = require("clime");
const Path = require("path");
require("source-map-support").install();
// The second parameter is the path to folder that contains command modules.
const cli = new clime_1.CLI("ec-wallet", Path.join(__dirname, "commands"));
// Clime in its core provides an object-based command-line infrastructure.
// To have it work as a common CLI, a shim needs to be applied:
const shim = new clime_1.Shim(cli);
shim.execute(process.argv);
//# sourceMappingURL=cli.js.map