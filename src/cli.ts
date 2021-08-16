import Explorer from "./Explorer";
import { ExplorerData } from "./ExplorerInterfaces";

const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const inquirer = require("inquirer");
const Table = require("cli-table");

/**
 * @class CLI
 * Command Line Interface prompts for user input
 *
 * TODO: Add flags like `--help`
 */
export default class CLI {
  title() {
    clear();

    console.log(
      chalk.yellow(
        figlet.textSync("BlockTracker", { horizontalLayout: "full" })
      )
    );
  }

  askExplorerType() {
    const question = {
      name: "explore",
      type: "list",
      message: "How would you like to explore?",
      choices: ["X blocks from current", "blocks X through Y"],
    };
    return inquirer.prompt(question);
  }

  askBlockCount() {
    const question = {
      name: "count",
      type: "input",
      message:
        "How many blocks back from the current block do you want to search?",
      validate: function (value: string) {
        if (!Number(value) && +value != 0) {
          return "Please type a valid block number.";
        }
        if (+value < 0) {
          return "Please type a block number >= 0.";
        }
        return true;
      },
    };
    return inquirer.prompt(question);
  }

  askRange() {
    const range = [
      {
        name: "start",
        type: "input",
        message: "What block would you like to start the search?",
        validate: function (value: string) {
          if (!Number(value) && +value != 0) {
            return "Please type a valid block number.";
          }
          if (+value < 0) {
            return "Please type a block number >= 0.";
          }
          return true;
        },
      },
      {
        name: "end",
        type: "input",
        message: "What block would you like to end the search?",
        validate: function (value: string) {
          if (!Number(value) && +value != 0) {
            return "Please type a valid block number.";
          }
          if (+value < 0) {
            return "Please type a block number >= 0.";
          }
          return true;
        },
      },
    ];
    return inquirer.prompt(range);
  }

  loading(start: number, end?: number) {
    if (end == undefined) {
      console.log(`Exploring block ${chalk.yellow(start)}...`);
    } else {
      clear();
      console.log(
        chalk.yellow(
          figlet.textSync("exploring...", { horizontalLayout: "full" })
        ),
        `\nblocks ${chalk.yellow(start)} to ${chalk.yellow(end)}`
      );
    }
  }

  //TODO update this to output type once implemented
  printOutput(data: ExplorerData) {
    this.title();
    console.log(`Current Block: ${chalk.yellow(data.current)}\n`);
    console.log(
      `Analytics between blocks ${chalk.yellow(data.start)} and ${chalk.yellow(
        data.end
      )}:\n`
    );

    var addresses = new Table({
      head: ["Address", "Ether Sent", "Ether Received", "Contract?"],
    });

    let uniqueSent = 0;
    let uniqueReceived = 0;
    for (const [address, value] of Object.entries(data.addresses)) {
      value.sent > 0 && ++uniqueSent;
      value.received > 0 && ++uniqueReceived;
      addresses.push([address, value.sent, value.received, value.isContract]);
    }

    var global = new Table();
    global.push(
      { "Total ETH Transferred": data.totalEth },
      { "Unique addresses sent transactions?": uniqueSent },
      { "Unique addresses received transactions?": uniqueReceived },
      { "How many contracts created?": data.contractsCreated }
    );

    let blockErrorCount = 0;
    var blockErrors = new Table({
      head: ["Error Encountered", "Block #"],
    });
    for (const [address, value] of Object.entries(data.blockErrors)) {
      ++blockErrorCount;
      blockErrors.push([value, address]);
    }

    let transactionErrorCount = 0;
    var transactionErrors = new Table({
      head: ["Error Encountered", "Transaction #"],
    });
    for (const [address, value] of Object.entries(data.blockErrors)) {
      ++transactionErrorCount;
      transactionErrors.push([value, address]);
    }

    console.log("Address Metrics");
    console.log(addresses.toString());

    console.log("Global Metrics");
    console.log(global.toString());

    if (blockErrorCount > 0) {
      console.log("Block Errors");
      console.log(blockErrors.toString());
    }
    if (transactionErrorCount > 0) {
      console.log("Transaction Errors");
      console.log(transactionErrors.toString());
    }
  }
}
