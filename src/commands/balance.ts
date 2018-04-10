import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  CONFIG_DIR,
  CONFIG_PATH,
  ELIPITCOIN_SEED_EDGE_SERVERS,
  PRIVATE_KEY,
  PUBLIC_KEY,
} from "../constants";
import Client from "../ellipticoin/client";
import Contract from "../ellipticoin/contract";
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
  description: 'Get account balances',
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
    let addressBuffer = await client.resolveAddress(address);

    const baseToken = Contract(
      client,
      BASE_CONTRACT_ADDRESS,
      BASE_CONTRACT_NAME
    );

    let balance = await baseToken.balanceOf(addressBuffer);

    return `Balance of ${humanReadableAddress(addressBuffer)}\n${formatBalance(balance)}`;
  }
}
