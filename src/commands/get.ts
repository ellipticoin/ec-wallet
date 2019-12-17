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
const base64urlToBuffer = require("base64url").toBuffer;

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
      description: "key",
      required: true
    })
    keyString: string
  ) {
    const client = Client.fromConfig(CONFIG_PATH);
    const addressBuffer = base64urlToBuffer(address);
    const key = new Buffer(keyString, "base64");
    const value = await client.getMemory(addressBuffer, contractName, key);
    return Buffer.from(value);
  }
}
