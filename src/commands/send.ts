const BigNumber = require('bignumber.js');
const request = require("request-promise");
const cbor = require("cbor");
import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  PRIVATE_KEY,
  PUBLIC_KEY,
  ELIPITCOIN_SEED_EDGE_SERVERS,

} from "../constants";
import Contract from "../ellipticoin/contract";
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
    amountString: string,
  ) {
    const client = Client.fromConfig();

    let receiverBuffer = await client.resolveAddress(receiver);
    const baseToken = new Contract(
      client,
      BASE_CONTRACT_ADDRESS,
      BASE_CONTRACT_NAME
    );
    let amount = BigNumber(amountString).times(10000).toNumber();
    baseToken.post("transfer", receiverBuffer, amount);
    return `Transferred ${amountString} to ${receiver}`;
  }
}
