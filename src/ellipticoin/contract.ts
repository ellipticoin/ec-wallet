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

  constructor(client, contractAddress, contractName) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.contractName = contractName;
  }

  getMemory(key) {
    return this.client.getMemory(
      this.contractAddress,
      this.contractName,
      key,
    );
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
