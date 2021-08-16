import { web3 } from "./web3";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerData,
  RunParams,
} from "./ExplorerInterfaces";

/**
 * @class Explorer
 * A basic blockchain explorer, given a range of blocks
 * it returns useful analytics
 */

export default class Explorer {
  constructor() {}

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

  private eth(wei: string) {
    return +web3.utils.fromWei(wei, "ether");
  }

  private sanitizeInputs(start: number, end: number, current: number) {
    // If the user has selected "X blocks from current", update values
    if (end == undefined) {
      end = current;
      start = current - start;
    }

    // If the user entered a higher start value, swap them
    if (start > end) {
      const tempStart = start;
      start = end;
      end = tempStart;
    }
    return [start, end];
  }

  private async findOrCreateAddress(
    address: string,
    addresses: Addresses
  ): Promise<Address> {
    if (!addresses.hasOwnProperty(address)) {
      const isContract = await this.isContract(address);
      addresses[address] = { received: 0, sent: 0, isContract };
    }
    return addresses[address];
  }

  private async processTransactionData(
    transaction: Transaction,
    data: ExplorerData
  ) {
    //Process contract creation
    if (transaction.to == null) {
      ++data.contractsCreated;
    }

    if (+transaction.value > 0) {
      const ether = this.eth(transaction.value);

      //Process total ether transferred
      data.totalEth += ether;

      // Process "to" address value
      const to = await this.findOrCreateAddress(transaction.to, data.addresses);
      to.received += ether;

      // Process "from" address
      const from = await this.findOrCreateAddress(
        transaction.from,
        data.addresses
      );
      from.sent += ether;
    }
  }

  /**
   * run(loading)
   * Parses a blockchain given start and end blocks
   *
   * @param loading - An optional loading function to call
   */
  async run({ start, end, loading }: RunParams): Promise<ExplorerData> {
    let current = await this.getCurrentBlock();

    // Ensure range is lowest -> highest
    [start, end] = this.sanitizeInputs(start, end, current);

    // Render optional loading screen
    if (loading) {
      loading(start, end);
    }

    let data = this.initializeOutput(start, end, current);

    for (let i = start; i <= end; i++) {
      //TODO catch errors
      let block = await web3.eth.getBlock(i);
      for (let t = 0; t < block.transactions.length; t++) {
        //TODO catch errors
        const transaction = await web3.eth.getTransaction(
          block.transactions[t]
        );
        await this.processTransactionData(transaction, data);
      }
    }

    return data;
  }
}
