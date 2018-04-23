extern crate ellipticoin_test_framework;
use base_token::*;
use base_token_test::ellipticoin_test_framework::FakeBlockChain;
use base_token_test::ellipticoin_test_framework::SENDER;
use base_token_test::ellipticoin_test_framework::ALICE;

#[test]
fn balance_of() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let base_token =  ${projectName} { blockchain: fake_blockchain };
    base_token.constructor(100);
    let balance = base_token.balance_of(SENDER.to_vec());
    assert_eq!(balance, 100);
}

#[test]
fn transfer() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let base_token =  ${projectName} { blockchain: fake_blockchain };
    base_token.constructor(100);
    base_token.transfer(ALICE.to_vec(), 20).unwrap();
    let senders_balance = base_token.balance_of(SENDER.to_vec());
    assert_eq!(senders_balance, 80);
    let alices_balance = base_token.balance_of(ALICE.to_vec());
    assert_eq!(alices_balance, 20);
}

#[test]
#[should_panic]
fn transfer_insufficient_funds() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let base_token =  ${projectName} { blockchain: fake_blockchain };
    base_token.constructor(100);
    base_token.transfer(ALICE.to_vec(), 120).unwrap();
}
