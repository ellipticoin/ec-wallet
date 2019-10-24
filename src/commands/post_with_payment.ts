import {
  Command,
  command,
  metadata,
  param,
  params,
} from 'clime';
import TokenContract from "../ellipticoin/token_contract";
const fs = require("fs");
const {
  tokenContractFromString,
  humanReadableAddress,
  coerceArgs,
  fromBytesInt32,
} = require("../utils");
const ora = require('ora');
const Client = require("ec-client").Client;

@command({
  description: 'Call a state-modifying smart contract function',
})
export default class extends Command {
  client: any;

  async execute(
    @param({
      type: String,
      description: 'Token',
      required: true,
    })
    token: string,
    @param({
      type: String,
      description: 'Amount',
      required: true,
    })
    amount: number,
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
    func: string,
    @params({
      type: String,
      description: 'Function Parameters',
    })
    args: string[],
  ) {
    let client = Client.fromConfig();

    let addressBuffer = await client.resolveAddress(address);
    let tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    let transactionHash = await tokenContract.approve(addressBuffer, amount * 10000);
    console.log("Approving Payment");

    let spinner = ora('Waiting for transaction to be mined').start();
    let transaction = await client.waitForTransactionToBeMined(transactionHash);
    if(transaction.return_code == 0) {
      spinner.succeed(`Mined ${transaction.hash.toString("base64")}`);
      `Return value ${transaction.return_value}}`;
    } else {
      spinner.fail(transaction.return_value);
    }

    console.log("Posting Transaction");
    console.log("===================");
    console.log(`Contract Created By: ${address}`);
    console.log(`Contract Name: ${contractName}`);
    console.log(`Function: ${func}`);
    console.log(`Arguments: [\n  ${args.join(",\n  ")}\n]`)
    transactionHash =  await  client.post(
      await client.publicKey(),
      contractName,
      func,
      await coerceArgs(this.client, args)
    );
    transaction = await client.waitForTransactionToBeMined(transactionHash);
    spinner.start()
    if(transaction.return_code == 0) {
      spinner.succeed(`Mined ${transaction.hash.toString("base64")}`);

      if(transaction.return_value) {
        console.log(`Return value ${transaction.return_value}}`);
      }
    } else {
      spinner.fail(transaction.return_value);
    }
  }
}
