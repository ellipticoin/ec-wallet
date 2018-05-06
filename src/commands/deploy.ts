import Contract from "../ellipticoin/contract";
import {
  Command,
  command,
  metadata,
  param,
  params,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
} from "../constants";
const Client = require("../ellipticoin/client").default;
const fs = require("fs");
const {
  humanReadableAddress,
  fromBytesInt32,
  coerceArgs,
} = require("../utils")

@command({
  description: 'Deploy a smart contract',
})
export default class extends Command {
  async execute(
    @param({
      description: 'Contract name',
      required: true,
    })
    name: string,
    @param({
      description: 'WASM file path',
      required: true,
    })
    path: string,
    @params({
      type: String,
      description: 'Function Parameters',
    })
    params: string[],
  ) {
    const client = Client.fromConfig();
    const baseToken = new Contract(
      client,
      BASE_CONTRACT_ADDRESS,
      BASE_CONTRACT_NAME
    );

    await client.deploy(name, fs.readFileSync(path), await coerceArgs(client, params));
    let key = await client.publicKey();

    return `Deployed to ${humanReadableAddress(key)}/${name}
Run functions with \`ec-wallet call ${humanReadableAddress(key)} ${name} <method> <args>\``
  }
}
