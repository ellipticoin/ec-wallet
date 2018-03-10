import {
  CONFIG_DIR,
  CONFIG_PATH,

} from "../constants";

import {
  Command,
  command,
  metadata,
  param,
} from 'clime';
const yaml = require("js-yaml");
const mkdirp = require("mkdirp");
const ed25519 = require("ed25519");
const crypto = require("crypto");
const fs = require("fs");

@command()
export default class extends Command {
  @metadata
  execute() {
    const seed = crypto.randomBytes(32);
    const {publicKey, privateKey} = ed25519.MakeKeypair(seed);
    console.log(`Creating ${CONFIG_PATH}`)
    mkdirp(CONFIG_DIR);
    fs.writeFileSync(CONFIG_PATH, yaml.safeDump({
      privateKey: privateKey.toString("base64")
    }));

    return `Initialization done. Your elipticoin address is ${publicKey.toString('base64')}`;
  }
}
