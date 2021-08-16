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
      contractsCreated: 0,
      addresses: {},
      blockErrors: {},
      transactionErrors: {},
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

    // Traverse blocks
    for (let i = start; i <= end; i++) {
      try {
        let block = await web3.eth.getBlock(i);
        console.log(`Exploring block ${i}...`);

        // Traverse transactions
        for (let t = 0; t < block.transactions.length; t++) {
          try {
            const transaction = await web3.eth.getTransaction(
              block.transactions[t]
            );
            await this.processTransactionData(transaction, data);
          } catch (e) {
            data.transactionErrors[t.toString()] = e.toString();
            console.log(`Error processing transaction ${t}: ${e}`);
          }
        }
      } catch (e) {
        data.blockErrors[i.toString()] = e.toString();
        console.log(`Error processing block ${i}: ${e}`);
      }
    }

    return data;
  }
}
