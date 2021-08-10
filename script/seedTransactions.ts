import { web3 } from "../src/web3";

/**
 * Alice -> Bob 5 ETH
 */
export async function seedTransactions() {
  console.log("Started seeding test data");
  const accounts = await web3.eth.getAccounts();

  //generate Alice
  const alice = await web3.eth.personal.newAccount("alice");
  await web3.eth.personal.unlockAccount(alice, "alice", 10000);

  //generate Bob
  const bob = await web3.eth.personal.newAccount("alice");
  await web3.eth.personal.unlockAccount(alice, "alice", 10000);

  // ganache -> alice 6 ETH
  await web3.eth.sendTransaction({
    to: alice,
    from: accounts[0],
    value: web3.utils.toWei("6", "ether"),
  });

  // alice -> bob 5 ETH
  await web3.eth.sendTransaction({
    to: bob,
    from: alice,
    value: web3.utils.toWei("5", "ether"),
  });

  console.log("Finished seeding test data.");
  return [alice, bob];
}

// TODO
export async function clearSeeds() {}

//await web3.eth.getBalance(accounts[0], (err, bal) => {
//  console.log("Ganache balance", bal);
//});

//web3.eth.getBlockNumber().then((num) => {
//  console.log("block num: ", num);
//});
