const FakeBlockchain = require('./support/fake-blockchain');
const assert = require('assert');
const _ = require('lodash');
const UNKNOWN_ADDRESS = new Buffer("0000000000000000000000000000000000000000", "hex");
const SENDER = new Buffer("0000000000000000000000000000000000000001", "hex");
const RECEIVER = new Buffer("0000000000000000000000000000000000000002", "hex");
const ERROR_INSUFFICIENT_FUNDS = 1;
const ERROR_CODES = {
  INSUFFIENT_FUNDS: 1,
};

describe('${projectName}', function() {
  var blockchain;

  beforeEach(async () => {
    blockchain = new FakeBlockchain({
      defaultSender: SENDER,
    });

    await blockchain.loadFile("target/wasm32-unknown-unknown/release/${snakeCaseProjectName}.wasm");
  });

  afterEach(() => blockchain.reset());

  describe('constructor', function() {
    it('should initalize the sender with 100 tokens', async function() {
      await blockchain.call('constructor', 100);
      var result = await blockchain.call('balance_of', SENDER);

      assert.equal(result, 100);
    });
  });

  describe('balance_of', function() {
    it('should return your balance', async function() {
      await blockchain.call('constructor', 100);
      var result = await blockchain.call('balance_of', SENDER);

      assert.equal(result, 100);
    });

    it('should return 0 for unknown addresses', async function() {
      await blockchain.call('constructor', 100);
      var result = await blockchain.call('balance_of', UNKNOWN_ADDRESS);

      assert.equal(result, 0);
    });
  });

  describe('transfer', function() {
    it('decreases the senders balance by the amount specified', async function() {
      await blockchain.call('constructor', 100);
      await blockchain.call('transfer', RECEIVER, 20);

      var result = await blockchain.call('balance_of', SENDER);

      assert.equal(result, 80);
    });

    it('increases the receivers balance by the amount specified', async function() {
      await blockchain.call('constructor', 100);
      await blockchain.call('transfer', RECEIVER, 20);

      var result = await blockchain.call('balance_of', RECEIVER);

      assert.equal(result, 20);
    });

    it('returns an error if you try to send more tokens than you have', async function() {
      assert.throws(
        () => blockchain.call("transfer", RECEIVER, 120),
        /insufficient funds/,
      );
    });
  });
});
