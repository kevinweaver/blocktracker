import { web3 } from "../src/web3";

// There are probably tools to do this less manually,
// but at least this is explicit/clear
export async function seedTransactions() {
  console.log("started seeding");
  const accounts = await web3.eth.getAccounts();
  const alice = await web3.eth.personal.newAccount("alice");

  console.log("alice", alice);
  await web3.eth.personal.unlockAccount(alice, "alice", 10000);

  web3.eth.getBlockNumber().then((num) => {
    console.log("block num: ", num);
  });

  // ganache -> alice 5 ETH
  await web3.eth.sendTransaction({
    to: alice,
    from: accounts[0],
    value: web3.utils.toWei("5", "ether"),
  });

  web3.eth.getBlockNumber().then((num) => {
    console.log("block num: ", num);
  });

  console.log("finished seeding");
}

// TODO
export async function clearSeeds() {}

//await web3.eth.getBalance(accounts[0], (err, bal) => {
//  console.log("Ganache balance", bal);
//});
