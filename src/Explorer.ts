import { web3 } from "./web3";

export interface Address {
  sent: number;
  received: number;
  isContract: boolean;
}

export interface Addresses {
  [key: string]: Address;
}

export interface Transaction {
  to: string;
  from: string;
  value: string;
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
  //this.transactionErrors = 0

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.current = 0;
    this.addresses = {};
    //this.totalEth = 0;
    //this.contractsCreated = 0;
    //this.transactionErrors = 0
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

  private initializeAddressIfNew(address: string, addresses: Addresses) {
    let isContract = false; //TODO check if is contract
    if (!addresses.hasOwnProperty(address)) {
      addresses[address] = { received: 0, sent: 0, isContract };
    }
    return addresses;
  }

  private processTransactionData(
    transaction: Transaction,
    addresses: Addresses
  ) {
    // Process contract creation
    if (transaction.to == null) {
      //this.contractsCreated += 1
    }

    // Process to address
    this.initializeAddressIfNew(transaction.to, addresses);
    addresses[transaction.to].received += +transaction.value;

    // Process from address
    this.initializeAddressIfNew(transaction.from, addresses);
    addresses[transaction.from].sent += +transaction.value;
  }

  /**
   * run(loading)
   * Parses a blockchain given start and end block numbers to
   * return address and transaction analytics.
   *
   * @param loading - An optional loading function to console.log
   */
  async run(loading?: Function) {
    // TODO ensure values not OOB
    //this.validateInput()

    this.current = await this.getCurrentBlock();

    // Ensure range is lowest -> highest
    this.setRangeAscending();

    // Render optional loading screen
    if (loading) {
      loading(this.start, this.end);
    }

    let processedAddresses = {};
    for (let i = this.start; i <= this.end; i++) {
      //TODO catch errors
      let block = await web3.eth.getBlock(i);
      for (let t = 0; t < block.transactions.length; t++) {
        //TODO catch errors
        let transaction = await web3.eth.getTransaction(block.transactions[t]);
        this.processTransactionData(transaction, processedAddresses);
      }
    }

    return processedAddresses;
  }
}
