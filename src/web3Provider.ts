require("dotenv").config();
import Web3 from "web3";

// This allows us to easily mock providers for testing
export function provider() {
  return Web3.givenProvider || process.env.INFURA_MAINNET_ENDPOINT; //"ws://localhost:8545";
}
