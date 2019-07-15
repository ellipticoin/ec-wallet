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
  toBytesInt32,
  humanReadableAddress,
  formatBalance,
} = require("../utils");

const ed25519 = require('ed25519');
const cbor = require("cbor");
const nacl = require("tweetnacl");

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
  ) {
    const client = Client.fromConfig();
    let addressBuffer = new Buffer(address, "base64")
    let tokenContract = tokenContractFromString(token);
    tokenContract.setClient(client);
    let balance = await tokenContract.balanceOf(addressBuffer);
    return `Balance of ${addressBuffer.toString("base64")}\n${formatBalance(balance)}`;
  }
}

function tokenContractFromString(tokenString) {
  let tokens = {
    "EC": new TokenContract(new Buffer(32), "BaseToken")
  }
  if(tokens[tokenString]) {
    return tokens[tokenString];
  } else {
    let [address, contractName] = tokenString.split(":");
    return new TokenContract(new Buffer(address, "base64"), contractName)
  }
}
