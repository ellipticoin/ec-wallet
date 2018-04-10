import {
  Command,
  command,
  metadata,
  param,
} from 'clime';
const Client = require("../ellipticoin/client").default;
const fs = require("fs");
const {
  humanReadableAddress,
  fromBytesInt32,
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
  ) {
    const client = Client.fromConfig();

    return client.post("deploy", [name, fs.readFileSync(path)]).then(async (result) => {
      let key = await client.publicKey();
      return `Deployed to ${humanReadableAddress(key)}/${name}
Run functions with \`ec-wallet call ${humanReadableAddress(key)} ${name} <method> <args>\`
        `

    })
  }
}
