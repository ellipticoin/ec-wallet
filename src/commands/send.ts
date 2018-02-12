import { load } from "protobufjs";
import {
  Command,
  command,
  param,
} from 'clime';
const ed25519 = require('ed25519');

const PRIVATE_KEY = new Buffer("2a185960faf3ffa84ff8886e8e2e0f8ba0fff4b91adad23108bfef5204390483b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
const PUBLIC_KEY = new Buffer("b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
@command({
  description: 'Send Elipticoins',
})
export default class extends Command {
  execute(
    @param({
      description: 'the amount of tokens you\'d like to send',
      required: true,
    })
    amount: number,
    @param({
      description: 'the address you\'d like to send the tokens to',
      required: true,
    })
    receiver: string,
  ) {
    return load("src/protos.json").then(function(root) {
      const TransferArgs = root.lookupType("elipticoin.TransferArgs");
      const FuncAndArgs =  root.lookupType("elipticoin.FuncAndArgs");

      const transferArgs = TransferArgs.create({
        amount: 1,
        receiverAddress: new Buffer(receiver, 'base64'),
      });

      var funcAndArgs = FuncAndArgs.create({
        func: "transfer",
        args: TransferArgs.encode(transferArgs).finish(),
      });
      const transfer = FuncAndArgs.encode(funcAndArgs).finish();

      var funcAndArgsSigned = FuncAndArgs.encode(
        FuncAndArgs.create({
          func: "transfer",
          args: TransferArgs.encode(transferArgs).finish(),
          signature: ed25519.Sign(
            FuncAndArgs.encode(funcAndArgs).finish(),
            PRIVATE_KEY,
          ),
          publicKey: PUBLIC_KEY,
        })
      ).finish();
      
      return funcAndArgsSigned.toString("hex"));
    })
  }
}
