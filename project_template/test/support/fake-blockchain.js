const WasmRPC = require('wasm-rpc');
const { execFileSync } = require('child_process');
const cbor = require('cbor');
const { StringDecoder } = require('string_decoder');

class FakeBlockchain extends WasmRPC {
  constructor(params) {
    super({
      exports: {
      rust_begin_unwind: () => null,
      sender: () => {
        return this.writePointer(params.defaultSender);
      },
      read: (keyPtr) => {
        var key = this.readPointer(keyPtr);
        if(this.storage[key]) {
          return this.writePointer(this.storage[key]);
        } else {
          return this.writePointer(new Uint8Array([]));
        }
      },
      write: (keyPtr, valuePtr) => {
        var key = this.readPointer(keyPtr);
        var value = this.readPointer(valuePtr);

        this.storage[key] = value;
      },
      throw: console.log,
        __udivti3: () => null,
        __multi3: () => null,
        _call: (codePtr, methodPtr, paramsPtr, storageContextPtr) => {
          const decoder = new StringDecoder('utf8');
          var code = this.readPointer(codePtr);
          var method = decoder.write(new Buffer(this.readPointer(methodPtr)));
          var params = cbor.decode(new Buffer(this.readPointer(paramsPtr)));
          var storageContext = this.readPointer(storageContextPtr);
          return this.writePointer(this._call(code, method, params, storageContext));
        },
      }
    })

    this.storage = this.storage || {};
  }

  reset() {
    this.storage = {};
  }
  _call(code, method, params, storageContext) {
    var runWasmCode = `
      const cbor = require('cbor');
      const WasmRPC = require('wasm-rpc');
      const code = new Buffer("${new Buffer(code).toString("hex")}", "hex");
      const storageContext = new Buffer("${new Buffer(storageContext).toString("hex")}", "hex");
      const params = cbor.decode(new Buffer("${new Buffer(cbor.encode(params).toString("hex"))}", "hex"));
      const method = "${method}";
      function hexToBytes(hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
          return new Buffer(bytes);
      }

      async function run() {
        const wasm = new WasmRPC({
          exports: {
            sender: () => {
              return wasm.writePointer(hexToBytes("0000000000000000000000000000000000000001"));
            },
            read: (keyPtr) => {
              this.storage = this.storage || {};
              var key = wasm.readPointer(keyPtr);
              if(this.storage[key]) {
                return wasm.writePointer(this.storage[key]);
              } else {
                return wasm.writePointer(new Uint8Array([]));
              }
            },
            write: (keyPtr, valuePtr) => {
              var key = wasm.readPointer(keyPtr);
              var value = wasm.readPointer(valuePtr);

              this.storage = this.storage || {};
              this.storage[key] = value;
            },
            _call: () => null,
            rust_begin_unwind: () => null,
          }
        });
        await wasm.load(code);
        const result = wasm.call(method, ...params);
        process.stdout.write(Buffer.concat([
          new Buffer([0,0,0,0]),
          new Buffer(cbor.encode(result)),
        ]));
      };
      run();`;

    return execFileSync('node', ['-e', runWasmCode]);
  }
}

module.exports = FakeBlockchain;
