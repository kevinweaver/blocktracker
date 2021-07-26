require("dotenv").config();
const Web3 = require("web3");
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

console.log(process.env.INFURA_RINKEBY_ENDPOINT);
web3.eth.getAccounts().then(console.log);
