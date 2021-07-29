import { web3 } from "./web3";

/**
 * @class Explorer
 * A basic blockchain explorer, given a range of blocks
 * it returns useful analytics
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

  private async getCurrentBlock() {
    return (this.current = await web3.eth.getBlockNumber());
  }

  private setRangeAscending() {
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
    let addresses = {};

    // WIP - Search input blocks
    for (let i = this.start; i <= this.end; i++) {
      try {
        let block = await web3.eth.getBlock(i);

        //console.log(block);

        //if (block.transactions.length > 0) {
        //  // Search transactions
        //  block.transactions.forEach(function (t) {
        //    //
        //    web3.eth.getTransaction(t).then(console.log);
        //  });
        //}
      } catch (e) {
        console.log("Error retreiving from block " + i, e);
      }
    }

    //store transactions
    //for each transaction
    // if to == null, skip contract creation
    //from address += value
    //to address += value
    //total ether += value
    return [this.start, this.end];
  }
}
