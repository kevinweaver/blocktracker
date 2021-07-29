import { web3 } from "../src/web3";

export async function seedTransactions() {
  let alice = await web3.eth.personal.newAccount("alice");
  let bob = await web3.eth.personal.newAccount("bob");

  web3.eth.getBlockNumber().then(console.log);
  // alice -> bob 1 ETH
  // using the promise
  console.log("alice address", alice);
  console.log("bob address", bob);
  console.log("sending a transaction");

  web3.eth
    .sendTransaction({
      from: alice,
      to: bob,
      value: "1000000000000000",
    })
    .then(function (receipt) {
      console.log("receipt", receipt);
    });

  web3.eth.getBlockNumber().then(console.log);
}

// TODO
export async function clearSeeds() {}
