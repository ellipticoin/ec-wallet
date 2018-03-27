import {
  Command,
  command,
  metadata,
  param,
} from 'clime';
const Client = require("../ellipticoin/client").default;
const yaml = require("js-yaml");
const mkdirp = require("mkdirp");
const ed25519 = require("ed25519");
const crypto = require("crypto");
const fs = require("fs");
const promiseRetry = require('promise-retry');
const {
  CONFIG_DIR,
  CONFIG_PATH,
} = require("../constants");
const {
  humanReadableAddress,
  fromBytesInt32,
} = require("../utils")

@command({
  description: 'Generate an ec-wallet configuration file',
})
export default class extends Command {
  @metadata
  execute() {

    return promiseRetry((retry, attemptNumber) => {
      const seed = crypto.randomBytes(32);
      const {publicKey, privateKey} = ed25519.MakeKeypair(seed);
      const client = new Client({privateKey});
      client.call("register").catch(retry)

      return {publicKey, privateKey};
    }).then(({publicKey, privateKey}) => {
      console.log(`Creating ${CONFIG_PATH}`)
      mkdirp(CONFIG_DIR);
      fs.writeFileSync(CONFIG_PATH, yaml.safeDump({
        privateKey: privateKey.toString("base64")
      }));
      return `Initialization done. Your elipticoin address is ${humanReadableAddress(publicKey)}`
    });
  }
}
