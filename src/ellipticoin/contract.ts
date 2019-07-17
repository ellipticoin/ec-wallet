import Client from "./client";
import {
  CONFIG_PATH,
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  ELIPITCOIN_SEED_EDGE_SERVERS,
} from "../constants";
const _ = require("lodash");

export default class Contract {
  client: Client;
  contractAddress: Buffer;
  contractName: String;

  constructor(contractAddress, contractName) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
  }

  setClient(client) {
    this.client = client;
  }

  getMemory(key) {
    return this.client.getMemory(
      this.contractAddress,
      this.contractName,
      key,
    );
  }

  post(func, ...args) {
    return this.client.post(
      this.contractAddress,
      this.contractName,
      func,
      ...args
    );
  }
}
