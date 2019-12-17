import { Command, command, metadata, param, params } from "clime";
import {
  Client,
  coerceArgs,
  Contract,
  fromBytesInt32,
  objectHash,
  TokenContract,
  tokenContractFromString
} from "ec-client";
import ora from "ora";
import { CONFIG_PATH } from "../constants";
const base64url = require("base64url").default;
const base64urlToBuffer = require("base64url").toBuffer;

@command({
  description: "Call a state-modifying smart contract function"
})
export default class extends Command {
  public client: any;

  public async execute(
    @param({
      type: String,
      description: "Token",
      required: true
    })
    token: string,
    @param({
      type: String,
      description: "Amount",
      required: true
    })
    amount: number,
    @param({
      description: "Address",
      required: true
    })
    address: string,
    @param({
      description: "Contract",
      required: true
    })
    contractName: string,
    @param({
      description: "Function Name",
      required: true
    })
    func: string,
    @params({
      type: String,
      description: "Function Parameters"
    })
    args: string[]
  ) {
    const client = Client.fromConfig(CONFIG_PATH);
    const addressBuffer = base64urlToBuffer(address);
    const tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    const spinner = ora("Waiting for transaction to be mined").start();
    let transaction = await tokenContract.approve(
      addressBuffer,
      amount * 10000
    );

    let completedTransaction = await client.waitForTransactionToBeMined(
      transaction
    );
    if (completedTransaction.return_code == 0) {
      spinner.succeed(
        `Approved transfer: ${base64url(objectHash(transaction))}`
      );
    } else {
      spinner.fail(
        `Smart contract error: ${completedTransaction.return_value}`
      );
    }

    console.log("Posting Transaction");
    console.log("===================");
    console.log(`Contract Created By: ${address}`);
    console.log(`Contract Name: ${contractName}`);
    console.log(`Function: ${func}`);
    console.log(`Arguments: [\n  ${args.join(",\n  ")}\n]`);
    const contract = new Contract(addressBuffer, contractName);
    transaction = contract.createTransaction(
      func,
      ...(await coerceArgs(client, args))
    );
    spinner.start();
    const postedTransaction = await client.post(transaction);
    completedTransaction = await client.waitForTransactionToBeMined(
      postedTransaction
    );
    if (completedTransaction.return_code == 0) {
      spinner.succeed(
        `Mined transaction: ${base64url(objectHash(transaction))}`
      );
    } else {
      spinner.fail(
        `Smart contract error: ${completedTransaction.return_value}`
      );
    }
  }
}
