import Client from "./client";
import {
  CONFIG_PATH,
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  ELIPITCOIN_SEED_EDGE_SERVERS,
} from "../constants";
const _ = require("lodash");

class Contract {
  client: Client;
  contractAddress: Buffer;
  contractName: String;

  constructor(client, contractAddress, contractName) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.contractName = contractName;
  }

  post(method, ...params) {
    return this.client.post(
      this.contractAddress,
      this.contractName,
      method,
      params
    );
  }
}

export default function ContractProxy(client, contractAddress, contractName) {

  let contract = new Contract(client, contractAddress, contractName)
  return new Proxy(contract, {
    get: function (receiver, name) {
      // console.log(arguments)
      return receiver.post.bind(receiver, _.snakeCase(name));
    }
  });
}

