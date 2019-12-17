import base64url from "base64url";
import { Command, command, param, params } from "clime";
import { Client, coerceArgs, toAddress, transactionHash } from "ec-client";
import ora from "ora";
import { CONFIG_PATH } from "../constants";
const fs = require("fs");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@command({
  description: "Deploy a Smart Contract"
})
export default class extends Command {
  public async execute(
    @param({
      description: "WASM file path",
      required: true
    })
    path: string,
    @param({
      description: "Contract name",
      required: true
    })
    contractName: string,
    @params({
      type: String,
      description: "Constructor Parameters"
    })
    constructorParams: string[]
  ) {
    console.log(`Deploying ${contractName}`);
    const spinner = ora("Waiting for transaction to be mined").start();
    const client = Client.fromConfig(CONFIG_PATH);
    const key = await client.publicKey();
    const transaction = await client.deploy(
      contractName,
      fs.readFileSync(path),
      await coerceArgs(client, constructorParams)
    );

    const completedTransaction = await client.waitForTransactionToBeMined(
      transaction
    );
    if (completedTransaction.return_code == 0) {
      spinner.succeed(
        `Deployed in transaction ${base64url(
          transactionHash(completedTransaction)
        )}`
      );
      return `Transaction address: ${base64url(
        toAddress(Buffer.from(await client.publicKey()), contractName)
      )}`;
    } else {
      spinner.fail(
        `Smart contract error: ${completedTransaction.return_value}`
      );
    }
  }
}
