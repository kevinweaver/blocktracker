"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
var chalk = require("chalk");
var figlet = require("figlet");
var clear = require("clear");
var inquirer = require("inquirer");
var CLI = /** @class */ (function () {
    function CLI() {
    }
    CLI.prototype.title = function () {
        clear();
        console.log(chalk.yellow(figlet.textSync("BlockTracker", { horizontalLayout: "full" })));
    };
    CLI.prototype.askExplorerType = function () {
        var type = {
            name: "explore",
            type: "list",
            message: "How would you like to explore?",
            choices: ["X blocks from current", "blocks X through Y"],
        };
        return inquirer.prompt(type);
    };
    return CLI;
}());
exports.CLI = CLI;
exports.default = CLI;
//# sourceMappingURL=cli.js.map