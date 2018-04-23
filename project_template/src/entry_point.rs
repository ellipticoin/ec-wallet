use wasm_rpc::{
    Dereferenceable,
    Pointer,
    Responsable,
};
use cbor_no_std::{
    Value,
};

#[cfg(test)]
use test::fake_blockchain::FakeBlockChain;
#[cfg(not(test))]
use ellipticoin::ElipitcoinBlockchain;
use ${snakeCaseProjectName}::{${projectName}};


// TODO Generate these functions automatically with a [Procedural Macro](https://doc.rust-lang.org/book/first-edition/procedural-macros.html)
#[no_mangle]
pub fn constructor(balance: u32) -> Pointer {
    let rpc =  ${projectName} { blockchain: ElipitcoinBlockchain {} };
    rpc.constructor(balance as u64);
    (Ok(Value::Null)).to_response()
}


#[no_mangle]
pub fn balance_of(address_ptr: Pointer) -> Pointer {
    let rpc =  ${projectName} { blockchain: ElipitcoinBlockchain {} };

    let result = rpc.balance_of(address_ptr.to_bytes());
    (Ok(result as u32)).to_response()
}

#[no_mangle]
pub fn transfer(receiver_address_ptr: Pointer, amount: u32) -> Pointer {
    let rpc =  ${projectName} { blockchain: ElipitcoinBlockchain {} };
    let result = rpc.transfer(receiver_address_ptr.to_bytes(), amount as u64);
    result.to_response()
}
