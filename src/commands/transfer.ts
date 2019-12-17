import cbor from "cbor";
import { Command, command, param } from "clime";
import {
  Client,
  ELIPITCOIN_SEED_EDGE_SERVERS,
  objectHash,
  TokenContract,
  tokenContractFromString
} from "ec-client";
import ora from "ora";
import { CONFIG_DIR, CONFIG_PATH } from "../constants";
const base64url = require("base64url").default;
const base64urlToBuffer = require("base64url").toBuffer;

@command({
  description: "Get account balances"
})
export default class extends Command {
  public async execute(
    @param({
      description: "Token Contract Address/Ticker",
      required: true
    })
    token: string,
    @param({
      description: "Address",
      required: true
    })
    address: string,
    @param({
      description: "Amount",
      required: true
    })
    amount: number
  ) {
    const client = Client.fromConfig(CONFIG_PATH);
    const addressBuffer = base64urlToBuffer(address);
    const spinner = ora("Waiting for transaction to be mined").start();
    const tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    const transaction = await tokenContract.transfer(
      addressBuffer,
      amount * 10000
    );
    const completedTransaction = await client.waitForTransactionToBeMined(
      transaction
    );
    if (completedTransaction.return_code == 0) {
      spinner.succeed(`Mined ${base64url(objectHash(transaction))}`);
      return `Transferred ${amount} ${token} to ${base64url(addressBuffer)}`;
    } else {
      spinner.fail(
        `Smart contract error: ${completedTransaction.return_value}`
      );
    }
  }
}
