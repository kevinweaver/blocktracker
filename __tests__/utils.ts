import { web3 } from "../src/web3";

// set to any type as a work-around to web3.currentProvider.send() error:
// Property 'send' does not exist on type 'provider'.
let web3Provider: any = web3.currentProvider;

export const mockWeb3 = () => {};

export const eth = (amount: number) => {
  return +web3.utils.toWei(`${amount}`, "ether");
};

export const saveState = async () => {
  return await web3Provider.send(
    {
      jsonrpc: "2.0",
      method: "evm_snapshot",
      id: 0,
    },
    () => {}
  );
};

export const revertState = async () => {
  await web3Provider.send(
    {
      jsonrpc: "2.0",
      method: "evm_revert",
      params: [1],
      id: 0,
    },
    () => {}
  );
};

export async function seedUsers() {
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
