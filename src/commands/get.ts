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

@command({
  description: 'Call a read only smart contract function',
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
      description: 'Function Name',
      required: true,
    })
    method: string,
    @params({
      type: String,
      description: 'Function Parameters',
    })
    args: string[],
  ) {
    this.client = Client.fromConfig();

    let addressBuffer = await this.client.resolveAddress(address);

    let result =  await  this.client.get(
      await this.client.publicKey(),
      contractName,
      method,
      await coerceArgs(this.client, args)
    );

    return `${address}/${contractName}.${method}(${args.join(",")})\n=> ${result}`;
  }
}
