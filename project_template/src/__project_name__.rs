#[cfg(not(test))]
use alloc::vec::Vec;
use error::{self, Error};

use ellipticoin::*;

pub struct ${projectName}<T: BlockChain>  {
    pub blockchain: T
}

impl <B> ${projectName}<B> where B: BlockChain {
    pub fn constructor(&self, initial_supply: u64) {
        self.write(self.sender(), initial_supply);
    }

    pub fn balance_of(&self, address: Vec<u8>) -> u64 {
        self.read(&address)
    }

    pub fn transfer(&self, receiver_address: Vec<u8>, amount: u64)  -> Result<(), Error> {
        let sender_balance = self.read(&self.sender());
        let receiver_balance = self.read(&receiver_address);

        if sender_balance > amount {
            self.write(self.sender(), sender_balance - amount);
            self.write(receiver_address, receiver_balance + amount);
            Ok(())
        } else {
            Err(error::INSUFFIENT_FUNDS)
        }
    }

    fn sender(&self) -> Vec<u8> {
        self.blockchain.sender()
    }

    fn read(&self, key: &Vec<u8>) -> u64 {
        self.blockchain.read_u64(key.to_vec())
    }

    fn write(&self, key: Vec<u8>, value: u64) {
        self.blockchain.write_u64(key, value)
    }
}
