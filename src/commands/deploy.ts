const BigNumber = require('bignumber.js');
const cbor = require("cbor");
import {
  Command,
  command,
  param,
  params,
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
const fs = require("fs");
import {
  toBytesInt32,
  coerceArgs
} from "../utils";
const ed25519 = require('ed25519');

@command({
  description: 'Deploy a Smart Contract',
})
export default class extends Command {
  async execute(
    @param({
      description: 'WASM file path',
      required: true,
    })
    path: string,
    @param({
      description: 'Contract name',
      required: true,
    })
    contractName: string,
    @params({
      type: String,
      description: 'Constructor Parameters',
    })
    constructorParams: string[],
  ) {
    const client = Client.fromConfig();
    await client.deploy(contractName, fs.readFileSync(path), await coerceArgs(client, constructorParams));
    let key = await client.publicKey();

    return `Deployed ${contractName}`;
  }
}
