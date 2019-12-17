import { Command, command, metadata, param, params } from "clime";
import { Client } from "ec-client";
import { CONFIG_PATH } from "../constants";
const fs = require("fs");
const {
  humanReadableAddress,
  coerceArgs,
  fromBytesInt32
} = require("../utils");
const ora = require("ora");

@command({
  description: "Call a state-modifying smart contract function"
})
export default class extends Command {
  public client: any;

  public async execute(
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

    const addressBuffer = await this.client.resolveAddress(address);

    const transactionHash = await this.client.post(
      await this.client.publicKey(),
      contractName,
      func,
      await coerceArgs(this.client, args)
    );

    console.log("Posting Transaction");
    console.log("===================");
    console.log(`Contract Created By: ${address}`);
    console.log(`Contract Name: ${contractName}`);
    console.log(`Function: ${func}`);
    console.log(`Arguments: [\n  ${args.join(",\n  ")}\n]`);
    const spinner = ora("Waiting for transaction to be mined").start();
    const transaction = await this.client.waitForTransactionToBeMined(
      transactionHash
    );
    if (transaction.return_code == 0) {
      spinner.succeed(`Mined ${transaction.hash.toString("base64")}`);
      if (transaction.return_value) {
        return `Return value ${transaction.return_value}`;
      }
    } else {
      spinner.fail(transaction.return_value);
    }
  }
}
