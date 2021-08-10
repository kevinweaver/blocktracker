import { web3 } from "./web3";

interface Address {
  sent: number;
  received: number;
  isContract: boolean;
}

interface Addresses {
  [key: string]: Address;
}

// TODO Move this to a new object
//interface ExplorerOutput {
//  addresses: Addresses;
//  totalEth: number;
//}

/**
 * @class Explorer
 * A basic blockchain explorer, given a range of blocks
 * it returns useful analytics
 */
export default class Explorer {
  start: number;
  end: number;
  current: number;
  addresses: Addresses;
  //totalEth: number;
  //contractsCreated: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.current = 0;
    this.addresses = {};
    //this.totalEth = 0;
    //this.contractsCreated = 0;
  }

  private async getCurrentBlock() {
    return (this.current = await web3.eth.getBlockNumber());
  }

  private setRangeAscending() {
    // If the user has selected "X blocks from current", update values
    if (this.end == -1) {
      this.end = this.current;
      this.start = this.current - this.start;
    }

    // If the user entered a higher start value, swap them
    if (this.start > this.end) {
      let tempStart = this.start;
      this.start = this.end;
      this.end = tempStart;
    }
  }

  /**
   * run(loading)
   * Parses blockchain given start and end block numbers to
   * return address analytics.
   *
   * @param loading - An optional loading function to console.log
   */
  async run(loading?: Function) {
    this.current = await this.getCurrentBlock();

    // Ensure range is lowest -> highest
    this.setRangeAscending();

    // TODO ensure values not OOB
    //this.validateInput()

    // How much Ether trasferred total
    let totalEther = 0;

    //let addresses = [
    //  {"0x0000000000000000000000000000000000000000": {"sent": 0, "received": 0, "contract": false }}
    //]

    // Render optional loading callback
    if (loading) {
      let loadingScreen = loading(this.start, this.end);
    }

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

    // Example output
    //
  }
}
