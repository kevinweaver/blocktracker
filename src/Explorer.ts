//require("dotenv").config();
//console.log(process.env.INFURA_RINKEBY_ENDPOINT);
const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

/**
 * @class Explorer
 * A basic blockchain explorer, given a block start number
 * and an optional end number, it provide several analytics.
 */
export default class Explorer {
  start: number;
  end: number;

  constructor(start: number, end?: number) {
    this.start = start;
    this.end = end === undefined ? 0 : end;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  run() {
    console.log(this.start, this.end);

    web3.eth.getAccounts().then(console.log);
  }
}
