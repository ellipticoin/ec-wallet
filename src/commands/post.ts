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
  fromBytesInt32,
} = require("../utils");
const ADDRESS_REGEXP = /\w+\w+-\d+/;

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

    let result =  await  this.client.post(
      await this.client.publicKey(),
      contractName,
      method,
      await this.coerceArgs(args),
    ]);

    return `${address}/${contractName}.${method}(${args.join(",")})\n=> ${result}`;
  }

  async coerceArgs(args) {
   return Promise.all(args.map(async (arg) => {
      if(arg.match(ADDRESS_REGEXP)) {
        return await this.client.resolveAddress(arg);
      } else {
        return JSON.parse(arg);
      }
    }))
  }
}
