import CLI from "./cli";
import Explorer from "./Explorer";

/**
 * index.ts
 * Runs the CLI prompt and passes returned inputs into Explorer
 */
const promptInput = async () => {
  const cli = new CLI();

  // "BlockTracker"
  console.log(cli.title());

  // "How would you like to explore?"
  const type = await cli.askExplorerType();

  let start;
  let end;

  //Recieve start/end inputs
  if (type["explore"] == "X blocks from current") {
    start = await cli.askBlockCount();
    start = start["count"];
  }
  if (type["explore"] == "blocks X through Y") {
    let range = await cli.askRange();
    start = range["start"];
    end = range["end"];
  }

  // Cast strings to numbers
  return { start: +start, end: +end };
};

// Prompt input and return to Explorer
const run = async () => {
  const inputs = await promptInput();
  const explorer = new Explorer(inputs["start"], inputs["end"]);

  console.log("start", explorer.getStart());
  console.log("end", explorer.getEnd());
};

run();
