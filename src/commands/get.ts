import {
  Command,
  command,
  metadata,
  param,
  params,
} from 'clime';
import Client from "../ellipticoin/client";
const fs = require("fs");
const {
  humanReadableAddress,
  coerceArgs,
  fromBytesInt32,
} = require("../utils");
const ora = require('ora');

@command({
  description: 'Call a state-modifying smart contract function',
})
export default class extends Command {
  client: Client;

  async execute(
    @param({
      description: 'Address',
      required: true,
    })
    address: string,
    @param({
      description: 'Contract',
      required: true,
    })
    contractName: string,
    @param({
      description: 'key',
      required: true,
    })
    keyString: string,
  ) {
    let client = Client.fromConfig();

    let addressBuffer = await client.resolveAddress(address);
    let key = new Buffer(keyString.slice(7), "base64");
    let value = await client.getMemory(addressBuffer, contractName, key)
    console.log(Buffer.from(value));
  }
}
