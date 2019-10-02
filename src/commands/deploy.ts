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
const ora = require("ora");
const fs = require("fs");
import {
  toBytesInt32,
  coerceArgs
} from "../utils";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

    console.log(`Deploying ${contractName}`)
    const spinner = ora('Waiting for transaction to be mined').start();
    const client = Client.fromConfig();
    let key = await client.publicKey();
    let transactionHash = await client.deploy(contractName, fs.readFileSync(path), await coerceArgs(client, constructorParams));

    let transaction = await client.waitForTransactionToBeMined(transactionHash);
    if(transaction.return_code == 0) {
      spinner.succeed(`Deployed ${contractName}`);
    } else {
      spinner.fail(transaction.return_value);
    }
  }
}
