import Web3 from "web3";
import { provider } from "./web3Provider";

export const web3 = new Web3(provider());
