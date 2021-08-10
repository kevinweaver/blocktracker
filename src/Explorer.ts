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

  private newAddress() {
    let isContract = false; //TODO check if is contract
    return { received: 0, sent: 0, isContract };
  }

  private processTransactionData(transaction: Transaction) {
    // Process contract creation
    if (transaction.to == null) {
      //this.contractsCreated += 1
    }

    console.log(
      "PROCESSING",
      this.addresses,
      transaction.to,
      transaction.from,
      transaction.value
    );

    // Process to address
    if (transaction.to in this.addresses) {
      this.addresses[transaction.to].received += +transaction.value;
    } else {
      this.addresses[transaction.to] = this.newAddress();
      this.addresses[transaction.to].received = +transaction.value;
    }

    // Process from address
    if (transaction.from in this.addresses) {
      this.addresses[transaction.from].sent += +transaction.value;
    } else {
      this.addresses[transaction.from] = this.newAddress();
      this.addresses[transaction.from].sent = +transaction.value;
    }

    console.log("ADDRESSES", this.addresses);
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

    // WIP - Search input blocks
    for (let i = this.start; i <= this.end; i++) {
      try {
        let block = await web3.eth.getBlock(i);

        //console.log("SEARCHING BLOCK:");
        //console.log(block);

        if (block.transactions.length > 0) {
          // Search transactions
          //for (let t = 0; t < block.transactions.length; t++) {
          block.transactions.forEach(async (t) => {
            try {
              let transaction = await web3.eth.getTransaction(t);
              //this.processTransactionData();
              this.processTransactionData(transaction);

              //console.log("SEARCHING TRANSACTION:");
              //console.log(transaction);
            } catch (e) {
              //TODO log to this.transactionErrors
              console.log(
                "Error retreiving from transaction" + t + "in block " + i,
                e
              );
            }
          });
        }
      } catch (e) {
        console.log("Error retreiving from block " + i, e);
      }
    }
    console.log("ADDRESSES", this.addresses);
    return this.addresses;
  }
}
