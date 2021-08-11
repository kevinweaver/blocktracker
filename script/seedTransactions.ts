import { web3 } from "../src/web3";

/**
 * Alice -> Bob 5 ETH
 */
export async function seedUsers() {
  console.log("Started seeding test data");
  const accounts = await web3.eth.getAccounts();
  const ganache = accounts[0];

  //generate Alice
  const alice = await web3.eth.personal.newAccount("alice");
  await web3.eth.personal.unlockAccount(alice, "alice", 10000);

  //generate Bob
  const bob = await web3.eth.personal.newAccount("alice");
  await web3.eth.personal.unlockAccount(alice, "alice", 10000);

  return [ganache, alice, bob];
}

// TODO
export async function clearSeeds() {}

//await web3.eth.getBalance(accounts[0], (err, bal) => {
//  console.log("Ganache balance", bal);
//});

//web3.eth.getBlockNumber().then((num) => {
//  console.log("block num: ", num);
//});
