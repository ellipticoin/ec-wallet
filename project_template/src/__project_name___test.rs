extern crate ellipticoin_test_framework;
use ${snakeCaseProjectName}::*;
use ${snakeCaseProjectName}_test::ellipticoin_test_framework::FakeBlockChain;
use ${snakeCaseProjectName}_test::ellipticoin_test_framework::SENDER;
use ${snakeCaseProjectName}_test::ellipticoin_test_framework::ALICE;

#[test]
fn balance_of() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let ${snakeCaseProjectName} =  ${projectName} { blockchain: fake_blockchain };
    ${snakeCaseProjectName}.constructor(100);
    let balance = ${snakeCaseProjectName}.balance_of(SENDER.to_vec());
    assert_eq!(balance, 100);
}

#[test]
fn transfer() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let ${snakeCaseProjectName} =  ${projectName} { blockchain: fake_blockchain };
    ${snakeCaseProjectName}.constructor(100);
    ${snakeCaseProjectName}.transfer(ALICE.to_vec(), 20).unwrap();
    let senders_balance = ${snakeCaseProjectName}.balance_of(SENDER.to_vec());
    assert_eq!(senders_balance, 80);
    let alices_balance = ${snakeCaseProjectName}.balance_of(ALICE.to_vec());
    assert_eq!(alices_balance, 20);
}

#[test]
#[should_panic]
fn transfer_insufficient_funds() {
    let fake_blockchain =  FakeBlockChain {..Default::default()};
    let ${snakeCaseProjectName} =  ${projectName} { blockchain: fake_blockchain };
    ${snakeCaseProjectName}.constructor(100);
    ${snakeCaseProjectName}.transfer(ALICE.to_vec(), 120).unwrap();
}
