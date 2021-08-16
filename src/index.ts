import CLI from "./cli";
import Explorer from "./Explorer";

/**
 * index.ts
 * Runs the CLI prompt and passes returned inputs to Explorer
 */
export const run = async () => {
  const cli = new CLI();

  // "BlockTracker"
  cli.title();

  // "How would you like to explore?"
  const type = await cli.askExplorerType();

  const explorer = new Explorer();
  let start;
  let end;
  let output;

  //Recieve start/end inputs
  if (type["explore"] == "X blocks from current") {
    start = await cli.askBlockCount();
    start = start["count"];

    output = await explorer.run({ start: +start, loading: cli.loading });
  } else if (type["explore"] == "blocks X through Y") {
    let range = await cli.askRange();
    start = range["start"];
    end = range["end"];

    output = await explorer.run({
      start: +start,
      end: +end,
      loading: cli.loading,
    });
  }

  cli.printOutput(output);
};

run();
