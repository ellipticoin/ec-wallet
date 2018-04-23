pub use wasm_rpc::Error;

pub const INSUFFIENT_FUNDS: Error = Error {
    code: 1,
    message: "insufficient funds"
};
