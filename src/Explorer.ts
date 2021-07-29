import { web3 } from "./web3";

/**
 * @class Explorer
 * A basic blockchain explorer, given a block start number
 * and an optional end number, it provides several analytics.
 */
export default class Explorer {
  start: number;
  end: number;
  current: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.current = 0;
  }

  async getCurrentBlock() {
    return (this.current = await web3.eth.getBlockNumber());
  }

  setRangeAscending() {
    if (this.start > this.end) {
      let tempStart = this.start;
      this.start = this.end;
      this.end = tempStart;
    }
  }

  async run() {
    const current = await this.getCurrentBlock();

    // If the user has selected "X blocks from current", update values
    if (this.end == -1) {
      this.end = current;
      this.start = current - this.start;
    }

    // Ensure range is lowest -> highest
    this.setRangeAscending();

    console.log(this.start, this.end, this.current);

    // How much Ether trasferred total
    let totalEther = 0;
    // Which addresses received how much Ether
    let received = {};
    // Which addr sent how much ether
    let sent = {};
    // Which are contracts

    return [this.start, this.end];
  }
}
