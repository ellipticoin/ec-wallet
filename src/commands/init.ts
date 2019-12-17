import { Command, command, metadata, param } from "clime";
const Contract = require("../ellipticoin/contract").default;
const Client = require("../ellipticoin/client").default;
const yaml = require("js-yaml");
const mkdirp = require("mkdirp");
const crypto = require("crypto");
const libsodium = require("libsodium-wrappers-sumo");
const fs = require("fs");
const promiseRetry = require("promise-retry");
const {
  BASE_CONTRACT_ADDRESS,
  CONFIG_DIR,
  CONFIG_PATH
} = require("../constants");
const { humanReadableAddress, fromBytesInt32 } = require("../utils");

const humanReadableNameRegistery = new Contract(
  null,
  BASE_CONTRACT_ADDRESS,
  "HumanReadableNameRegistery"
);

const baseToken = new Contract(null, BASE_CONTRACT_ADDRESS, "BaseToken");

@command({
  description: "Generate an ec-wallet configuration file"
})
export default class extends Command {
  @metadata
  public async execute() {
    const seed = crypto.randomBytes(32);
    await libsodium.ready;
    const { publicKey, privateKey } = libsodium.crypto_sign_keypair();
    mkdirp(CONFIG_DIR);
    fs.writeFileSync(
      CONFIG_PATH,
      yaml.safeDump({
        privateKey: Buffer.from(privateKey).toString("base64")
      })
    );

    return `Initialization done. Your elipticoin address is ${Buffer.from(
      publicKey
    ).toString("base64")}`;
  }
}
