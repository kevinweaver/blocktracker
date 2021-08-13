import { web3 } from "./web3";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerOutput,
} from "./ExplorerInterfaces";

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

//TODO make Explorer functional
export default class Explorer {
  start: number;
  end: number;
  current: number;
  //totalEth: number;
  //contractsCreated: number;
  //this.transactionErrors = 0

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.current = 0;
    //this.totalEth = 0;
    //this.contractsCreated = 0;
    //this.transactionErrors = 0
  }

  private initializeOutput(start: number, end: number, current: number) {
    return {
      start,
      end,
      current,
      totalEth: 0,
      uncles: 0,
      sent: 0,
      received: 0,
      contracts: 0,
      addresses: {},
    };
  }

  private setRangeAscending(current: number) {
    // If the user has selected "X blocks from current", update values
    //TODO - set this to optional param
    if (this.end == -1) {
      this.end = current;
      this.start = current - this.start;
    }

    // If the user entered a higher start value, swap them
    if (this.start > this.end) {
      let tempStart = this.start;
      this.start = this.end;
      this.end = tempStart;
    }
    return [this.start, this.end];
  }

  // Finds or creates an Address in the hash
  private getAddress(address: string, addresses: Addresses): Address {
    let isContract = false; //TODO check if is contract
    if (!addresses.hasOwnProperty(address)) {
      addresses[address] = { received: 0, sent: 0, isContract };
    }
    return addresses[address];
  }

  private processTransactionData(
    transaction: Transaction,
    data: ExplorerOutput
  ) {
    if (transaction.to == null) {
      //this.contractsCreated += 1
    }

    // Process "to" address value
    this.getAddress(
      transaction.to,
      data.addresses
    ).received += +transaction.value;

    // Process "from" address
    this.getAddress(
      transaction.from,
      data.addresses
    ).sent += +transaction.value;
  }

  /**
   * run(loading)
   * Parses a blockchain given the explorer's start and end blocks
   *
   * @param loading - An optional loading function to console.log
   */
  async run(loading?: Function): Promise<ExplorerOutput> {
    // TODO ensure values not OOB
    //this.validateInput()

    let current = await web3.eth.getBlockNumber();

    // Ensure range is lowest -> highest
    let [start, end] = this.setRangeAscending(current);

    // Render optional loading screen
    if (loading) {
      loading(start, end);
    }

    let data = this.initializeOutput(start, end, current);

    for (let i = this.start; i <= this.end; i++) {
      //TODO catch errors
      let block = await web3.eth.getBlock(i);
      for (let t = 0; t < block.transactions.length; t++) {
        //TODO catch errors
        let transaction = await web3.eth.getTransaction(block.transactions[t]);
        this.processTransactionData(transaction, data);
      }
    }

    return data;
  }
}
