import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  CONFIG_DIR,
  CONFIG_PATH,
  ELIPITCOIN_EDGE_SERVER,
  PRIVATE_KEY,
  PUBLIC_KEY,
} from "../constants";
import Client from "../elipticoin/client";
import {toBytesInt32} from "../utils";

const request = require("request-promise");
const ed25519 = require('ed25519');
const cbor = require("cbor");
const nacl = require("tweetnacl");

@command({
  description: 'Elipticoin Client',
})
export default class extends Command {
  execute(
    @param({
      description: 'Address',
      required: false,
    })
    address: string,
  ) {
    const client = Client.fromConfig();

    address = address || client.publicKey;

    return client.call({
      method: "balance_of",
      params: [
        address
      ]
    }).then((balance) =>
      `Balance of ${client.publicKey.toString('base64')}\n${balance}`
    );
  }
}
