import {
  Command,
  command,
  metadata,
  param,
  params,
} from 'clime';
const Client = require("../ellipticoin/client").default;
const fs = require("fs");
const {
  humanReadableAddress,
  fromBytesInt32,
} = require("../utils")

@command({
  description: 'Call a smart contract function',
})
export default class extends Command {
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
    const client = Client.fromConfig();

    let addressBuffer = await client.resolveAddress(address);

    return client.call("call", [addressBuffer, contractName, method, parseInt(args[0])]).then(async (result) =>
      `${address} ${contractName} ${method} ${args.join(" ")}
Result: ${result}
      `
    )
  }
}
