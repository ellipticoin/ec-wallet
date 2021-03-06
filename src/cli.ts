#!/usr/bin/env node

import { CLI, Shim } from "clime";
import * as Path from "path";

require("source-map-support").install();
// The second parameter is the path to folder that contains command modules.
const cli = new CLI("ec-wallet", Path.join(__dirname, "commands"));

// Clime in its core provides an object-based command-line infrastructure.
// To have it work as a common CLI, a shim needs to be applied:
const shim = new Shim(cli);
shim.execute(process.argv);
