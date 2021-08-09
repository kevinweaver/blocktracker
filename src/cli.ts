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
        if (value.length && !!Number(value)) {
          return true;
        } else {
          return "Please type a number of blocks.";
        }
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
          if (value.length && !!Number(value) && +value >= 0) {
            if (+value < 0) {
              return "Please type a block number > 0.";
            }
            return true;
          } else {
            return "Please type a valid block number.";
          }
        },
      },
      {
        name: "end",
        type: "input",
        message: "What block would you like to end the search?",
        validate: function (value: string) {
          if (value.length && !!Number(value)) {
            return true;
          } else {
            return "Please type a block number.";
          }
        },
      },
    ];
    return inquirer.prompt(range);
  }

  loading(start: number, end: number) {
    clear();

    console.log(
      chalk.yellow(
        figlet.textSync("exploring...", { horizontalLayout: "full" })
      ),
      `\nblocks ${chalk.yellow(start)} to ${chalk.yellow(end)}`
    );
  }

  //TODO update this to output type once implemented
  printOutput(data: any) {
    this.title();
    let start = 5;
    let end = 10;
    console.log(
      `Analytics between blocks ${chalk.yellow(start)} and ${chalk.yellow(
        end
      )}:\n`
    );

    var sent = new Table({
      head: ["Address", "Ether Sent", "Contract?"],
    });
    sent.push(
      ["0x0000000000000000000000000000000000000000", "42", ""],
      ["0x0000000000000000000000000000000000000001", "42", ""]
    );

    var received = new Table({
      head: ["Address", "Ether Received", "Contract?"],
    });
    received.push(
      ["0x0000000000000000000000000000000000000000", "42", ""],
      ["0x0000000000000000000000000000000000000001", "42", "X"]
    );

    var meta = new Table();
    meta.push(
      { "Total ETH Transferred": "708" },
      { "Unique addresses sent transactions?": "2" },
      { "Unique addresses received transactions?": "3" },
      { "How many uncle blocks?": "6" },
      { "How many contracts created?": "6" }
    );

    console.log("Address Metrics");
    console.log(sent.toString());
    console.log(received.toString());

    console.log("Global Metrics");
    console.log(meta.toString());
  }
}
