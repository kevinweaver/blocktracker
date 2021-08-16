# BlockTracker

A basic Ethereum block explorer. Takes a block range and
returns analytics about the transactions within.

## Develop

First, to install dependencies, run:
`yarn install`

Then, to compile typescript files, run:
`yarn build`

Finally, to run the app:
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

![Current Block Demo](http://www.giphy.com/gifs/OO1vDmvSmSlaNwSnof)

2. Exploring blocks X through Y.

![Block Range Demo](http://www.giphy.com/gifs/szulUCjRZOUVZPOjai)
