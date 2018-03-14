import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  CONFIG_DIR,
  CONFIG_PATH,
  ELIPITCOIN_SEED_EDGE_SERVERS,
  PRIVATE_KEY,
  PUBLIC_KEY,
} from "../constants";
import Client from "../elipticoin/client";
const {
  toBytesInt32,
  humanReadableAddress,
  formatBalance,
} = require("../utils");

const request = require("request-promise");
const ed25519 = require('ed25519');
const cbor = require("cbor");
const nacl = require("tweetnacl");

@command({
  description: 'Elipticoin Client',
})
export default class extends Command {
  async execute(
    @param({
      description: 'Address',
      required: false,
    })
    address: string,
  ) {
    const client = Client.fromConfig();

    return client.resolveAddress(address)
      .then((addressBuffer) => {
        return client.call("balance_of", [addressBuffer]).then((balance) =>
          `Balance of ${humanReadableAddress(addressBuffer)}\n${formatBalance(balance)}`
        );
      })
  }
}
