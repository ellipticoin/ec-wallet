const request = require("request-promise");
const cbor = require("cbor");
import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  PUBLIC_KEY,
  ELIPITCOIN_SEED_EDGE_SERVERS,

} from "../constants";
import Client from "../ellipticoin/client";
import {toBytesInt32} from "../utils";
const ed25519 = require('ed25519');

@command({
  description: 'Send Elipticoins',
})
export default class extends Command {
  async execute(
    @param({
      description: 'the address you\'d like to send the tokens to',
      required: true,
    })
    receiver: string,
    @param({
      description: 'the amount of tokens you\'d like to send',
      required: true,
    })
    amount: number,
  ) {
    const client = Client.fromConfig();

    let receiverBuffer = await client.resolveAddress(receiver);
    await client.post(
      "transfer",
      [receiverBuffer, amount * 10000]
    );

    return `Transferred ${amount} to ${receiver}`;
  }
}
