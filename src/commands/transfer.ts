import {
  Command,
  command,
  param,
} from 'clime';
import {
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  CONFIG_DIR,
  CONFIG_PATH,
  ELIPITCOIN_SEED_EDGE_SERVERS,
  PRIVATE_KEY,
  PUBLIC_KEY,
} from "../constants";
import Client from "../ellipticoin/client";
import TokenContract from "../ellipticoin/token_contract";
const {
  tokenContractFromString,
  toBytesInt32,
  humanReadableAddress,
  formatBalance,
  transactionHash,
} = require("../utils");

const cbor = require("cbor");
const nacl = require("tweetnacl");
const retry = require("async-retry");
const ora = require('ora');

@command({
  description: 'Get account balances',
})
export default class extends Command {
  async execute(
    @param({
      description: 'Token Contract Address/Ticker',
      required: true,
    })
    token: string,
    @param({
      description: 'Address',
      required: true,
    })
    address: string,
    @param({
      description: 'Amount',
      required: true,
    })
    amount: number,
  ) {
    const client = Client.fromConfig();
    let addressBuffer = new Buffer(address, "base64")
    const spinner = ora('Waiting for transaction to be mined').start();
    let tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    let transactionHash = await tokenContract.transfer(addressBuffer, amount * 10000);
    let transaction = await client.waitForTransactionToBeMined(transactionHash);
    if(transaction.return_code == 0) {
      spinner.succeed(`Mined ${transaction.hash.toString("base64")}`);
      return `Transferred ${amount} ${token} to ${addressBuffer.toString("base64")}`;
    } else {
      spinner.fail(`Smart contract error: ${transaction.return_value}`);
    }
  }
}
