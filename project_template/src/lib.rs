#![cfg_attr(not(test), no_std)]
#![feature(
    global_allocator,
    alloc,
    core_intrinsics,
    lang_items,
    )]
#[cfg(not(test))]
extern crate alloc;
extern crate cbor_no_std;
extern crate ellipticoin;
extern crate wasm_rpc;
#[cfg(not(test))]
extern crate wee_alloc;
mod ${snakeCaseProjectName};
mod error;

#[cfg(test)]
mod ${snakeCaseProjectName}_test;
#[cfg(not(test))]
pub mod entry_point;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
#[cfg(not(test))]
#[lang = "panic_fmt"] fn panic_fmt() -> ! { loop {} }

