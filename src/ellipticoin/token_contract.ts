import Contract from "./contract";
import {
  bytesToNumber,
} from "../utils";
const BALANCE_KEY = new Buffer([0]);

export default class TokenContract extends Contract {
  async balanceOf (address) {
    let balanceBytes = await this.getMemory(Buffer.concat([BALANCE_KEY, address]));

    if (balanceBytes) {
      return bytesToNumber(balanceBytes);
    } else {
      return 0;
    }
  }
}
