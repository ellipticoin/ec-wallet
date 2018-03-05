#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var Path = require("path");
var clime_1 = require("clime");
// The second parameter is the path to folder that contains command modules.
var cli = new clime_1.CLI('ec-wallet', Path.join(__dirname, 'commands'));
// Clime in its core provides an object-based command-line infrastructure.
// To have it work as a common CLI, a shim needs to be applied:
var shim = new clime_1.Shim(cli);
shim.execute(process.argv);
