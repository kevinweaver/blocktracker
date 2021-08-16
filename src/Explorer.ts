import { web3 } from "./web3";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerData,
} from "./ExplorerInterfaces";

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

  //TODO - make end optional
  private initializeOutput(
    start: number,
    end: number,
    current: number
  ): ExplorerData {
    return {
      start,
      end,
      current,
      totalEth: 0,
      uncles: 0,
      sent: 0,
      received: 0,
      contractsCreated: 0,
      addresses: {},
    };
  }

  async getCurrentBlock(): Promise<number> {
    return await web3.eth.getBlockNumber();
  }

  async isContract(address: string): Promise<boolean> {
    return (await web3.eth.getCode(address)) != "0x";
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

  private async findOrCreateAddress(
    address: string,
    addresses: Addresses
  ): Promise<Address> {
    if (!addresses.hasOwnProperty(address)) {
      let isContract = await this.isContract(address);
      addresses[address] = { received: 0, sent: 0, isContract };
    }
    return addresses[address];
  }

  private async processTransactionData(
    transaction: Transaction,
    data: ExplorerData
  ) {
    //TODO - confirm
    if (transaction.to == null) {
      ++data.contractsCreated;
    }

    // Process "to" address value
    let to = await this.findOrCreateAddress(transaction.to, data.addresses);
    to.received += +transaction.value;

    // Process "from" address
    let from = await this.findOrCreateAddress(transaction.from, data.addresses);
    from.sent += +transaction.value;
  }

  /**
   * run(loading)
   * Parses a blockchain given the explorer's start and end blocks
   *
   * @param loading - An optional loading function to call
   */
  async run(loading?: Function): Promise<ExplorerData> {
    // TODO ensure values not OOB
    //this.validateInput()

    let current = await this.getCurrentBlock();

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
        await this.processTransactionData(transaction, data);
      }
    }

    return data;
  }
}
