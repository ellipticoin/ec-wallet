import { Command, command, param } from "clime";
import { Client, TokenContract } from "ec-client";
import { CONFIG_PATH } from "../constants";
const {
  toBytesInt32,
  humanReadableAddress,
  formatBalance
} = require("../utils");

const cbor = require("cbor");
const nacl = require("tweetnacl");

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
    address: string
  ) {
    const client = Client.fromConfig(CONFIG_PATH);
    const addressBuffer = new Buffer(address, "base64");
    const tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    const balance = await tokenContract.balanceOf(addressBuffer);
    return `Balance of ${addressBuffer.toString("base64")}\n${formatBalance(
      balance
    )}`;
  }
}

function tokenContractFromString(tokenString) {
  const tokens = {
    EC: new TokenContract(new Buffer(32), "System")
  };
  if (tokens[tokenString]) {
    return tokens[tokenString];
  } else {
    const [address, contractName] = tokenString.split(":");
    return new TokenContract(new Buffer(address, "base64"), contractName);
  }
}
