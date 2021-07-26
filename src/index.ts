/**
 * index.ts
 *
 * Runs the CLI prompt and passes input to Explorer
 */

import CLI from "./cli";

const promptInput = async () => {
  const cli = new CLI();

  // BlockTracker
  console.log(cli.title());

  //How would you like to explore?
  const type = await cli.askExplorerType();

  let start = "";
  let end = "";

  //Recieve start/end inputs
  if (type["explore"] == "X blocks from current") {
    start = await cli.askBlockCount()["count"];
  }
  if (type["explore"] == "blocks X through Y") {
    let range = await cli.askRange();
    start = range["start"];
    end = range["end"];
  }
  return [start, end];
};

const run = async () => {
  const input = await promptInput();
  console.log("input", input);
  console.log("DONE!");
};

run();
