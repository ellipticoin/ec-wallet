import {
  CONFIG_PATH,
  BASE_CONTRACT_ADDRESS,
  BASE_CONTRACT_NAME,
  ELIPITCOIN_SEED_EDGE_SERVERS,
} from "../constants";
import {
  toBytesInt32,
  fromBytesInt32,
  humanReadableAddressToU32Bytes,
  toKey,
  base64url,
} from "../utils";
const libsodium = require('libsodium-wrappers-sumo');
const fetch = require("node-fetch");
const _ = require("lodash");
const cbor = require("borc");
const nacl = require("tweetnacl");
const fs = require("fs");
const yaml = require("js-yaml");
const path = require('path');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Client {
  privateKey: Buffer;
  contractAddress: Buffer;
  contractName: String;
  nonce: number;

  constructor({
    privateKey,
    contractAddress,
    contractName,
  }) {
    this.privateKey = privateKey;
    this.contractName = contractName;
    this.contractAddress = contractAddress;
    this.nonce = 0;
  }

  static fromConfig() {
    const privateKey = new Buffer(yaml.safeLoad(fs.readFileSync(CONFIG_PATH)).privateKey, "base64");
    return new this({
      contractAddress: null,
      contractName: null,
      privateKey,
    })
  }

  edgeServer() {
    // Once we go live we'll ask the seed servers for their peers
    // and call a list of edge nodes round-robin.
    // For now just send transactions directly to the seed nodes

    return _.sample(ELIPITCOIN_SEED_EDGE_SERVERS);
  }

  async resolveAddress(address){
    if ( address && address.endsWith("=")) {
      return new Buffer(address, "base64")
    } else if (address) {
      return this.post(
        BASE_CONTRACT_ADDRESS,
        "HumanReadableNameRegistery",
        "lookup",
        [humanReadableAddressToU32Bytes(address)]);
    } else {
      return await this.publicKey()
    }
  }

  async sign(message) {
    await libsodium.ready;
    return libsodium.crypto_sign_detached(message, this.privateKey)
  }

  async publicKey() {
    await libsodium.ready;
    return new Buffer(libsodium.crypto_sign_ed25519_sk_to_pk(this.privateKey))
  }

  async deploy(
    contractName,
    contractCode,
    params,
  ) {
    return this.post(
      new Buffer(32),
      "system",
      "create_contract",
      [contractName, contractCode, params]
    );
  }

  async post(
    contractAddress,
    contractName,
    func,
    args=[]
  ) {
    const body = {
      contract_address: Buffer.concat([
        contractAddress,
        Buffer.from(contractName)
      ]),
      sender: await this.publicKey(),
      nonce: 0,
      gas_limit: 100000000,
      function: func,
      arguments: args,
    };

    const signedBody = cbor.encode({
      ...body,
      signature: new Buffer(await this.sign(cbor.encode(body))),
    });
    return fetch(this.edgeServer() + "/transactions", {
      method: "POST",
      body: signedBody,
      headers: {
        "Content-Type": "application/cbor",
      }
    }).then(async (response) => {
      if(response.status == 500) {
          throw await response.text();
      };
      let arrayBuffer = await response.arrayBuffer();
      if(arrayBuffer.byteLength) {
        return cbor.decode(Buffer.from(arrayBuffer));
      }
    }).catch((error) => {
      throw `Contract error: ${error}`;
    });
  }

  async waitForTransactionToBeMined(transactionHash, tries = 600) {
      try {
        return await this.getTransaction(transactionHash);
      } catch (err) {
        if (tries == 1) throw new Error("Transaction too too long to be mined");
        await sleep(500)
        return await this.waitForTransactionToBeMined(transactionHash, tries - 1);
      }
  }

  async getTransaction(
    transactionHash,
  ) {
    return fetch(this.edgeServer() + "/transactions/" + base64url(transactionHash)).then(async (response) => {

      let arrayBuffer = await response.arrayBuffer();
      if(response.status == 404) {
        throw new Error("Transaction not found")
      } else {
        return cbor.decode(Buffer.from(arrayBuffer))
      }
      });
  }

  async getMemory(
    contractAddress,
    contractName,
    key,
    params=[]
  ) {
    let fullKey = toKey(
      contractAddress,
      contractName,
      key
    );

    return fetch(this.edgeServer() + "/memory/" + base64url(fullKey)).then(async (response) => {
      let arrayBuffer = await response.arrayBuffer();
      if(arrayBuffer.byteLength) {
        return arrayBuffer;
      } else {
        return null;
      }
    }).catch((error) => {
      if (error.response) {
        throw `Contract error: ${error.response.body.toString()}`;
      } else {
        throw error;
      }
    });
  }
}
