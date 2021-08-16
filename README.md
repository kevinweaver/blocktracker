# BlockTracker

A basic Ethereum block explorer CLI tool. Takes a block range and
returns analytics about the transactions within.  See demo gifs below.

## Develop

First time setup, you'll need to add an infura network key to a `.env` file. If you don't have one, just copy the example key:

`cp .env.example .env`

Install dependencies with:

`yarn install`

Compile typescript files with:

`yarn build`

Run the app with:

`yarn start`

\*\*Optional: To run app via ts-node without building:

`yarn dev`

## Testing

To run tests:

`yarn test`

## Important Files

| File            |                                     Description                                      |
| --------------- | :----------------------------------------------------------------------------------: |
| src/cli.ts      |                     The command line interface for the Explorer.                     |
| src/Explorer.ts |   The class that functions to traverse a blockchain and return various analytics.    |
| src/index.ts    |             Takes the output of the CLI and provides it to the Explorer.             |
| TODO.md         | I typically wouldn't check this in, but did so in this case to document my approach. |

## Demo

BlockTracker has two input types:

1. Exploring X blocks from current.

[Current Block Demo](http://www.giphy.com/gifs/OO1vDmvSmSlaNwSnof/giphy.gif)

2. Exploring blocks X through Y.

[Block Range Demo](http://www.giphy.com/gifs/szulUCjRZOUVZPOjai/giphy.gif)
