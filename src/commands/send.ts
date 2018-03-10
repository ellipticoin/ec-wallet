const request = require("request-promise");
const cbor = require("cbor");
import { load } from "protobufjs";
import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  PUBLIC_KEY,
  ELIPITCOIN_EDGE_SERVER,

} from "../constants";
import Client from "../elipticoin/client";
import {toBytesInt32} from "../utils";
const ed25519 = require('ed25519');

@command({
  description: 'Send Elipticoins',
})
export default class extends Command {
  execute(
    @param({
      description: 'the amount of tokens you\'d like to send',
      required: true,
    })
    amount: number,
    @param({
      description: 'the address you\'d like to send the tokens to',
      required: true,
    })
    receiver: string,
  ) {
    // const receiverAddress = new Buffer(receiver, 'base64');
    // const rpc_call = cbor.encode({
    //   method: "transfer",
    //   params: [
    //     receiverAddress,
    //     amount,
    //   ]
    // });
    //
    // const nonce = toBytesInt32(0);
    // const message = Buffer.concat([
    //   PUBLIC_KEY,
    //   nonce,
    //   BASE_CONTRACT_ADDRESS,
    //   rpc_call,
    // ]);
    //
    // const body = Buffer.concat([
    //   ed25519.Sign(message, PRIVATE_KEY),
    //   message
    // ]);
    //
    // return request({
    //   url: ELIPITCOIN_EDGE_SERVER,
    //   method: "POST",
    //   encoding: null,
    //   body,
  // })
    const client = Client.fromConfig();

    return client.call({
      method: "transfer",
      params: [
        new Buffer(receiver, 'base64'),
        amount,
      ]
    }).then(() => {
      return `Transferred ${amount} to ${receiver}`
    })

  }
}
