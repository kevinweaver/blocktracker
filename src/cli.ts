const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const inquirer = require("inquirer");

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
          if (value.length && !!Number(value)) {
            return true;
          } else {
            return "Please type a block number.";
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
}
