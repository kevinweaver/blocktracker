/**
 * index.ts
 *
 * Implements the CLI prompt
 */

import CLI from "./cli";

const run = async () => {
  const cli = new CLI();

  // BlockTracker
  console.log(cli.title());

  //How would you like to explore?
  const inputs = await cli.askExplorerType();

  console.log(inputs);
};

run();
