import dotenv from 'dotenv';
import chalk from 'chalk';
import { RpcProvider } from 'starknet';
dotenv.config();

const log_green = (output) => {
  console.log(chalk.green(output));
}

// Network configuration
import config from "../config.js"
const networks = config.networks;

const rpcProvider = new RpcProvider({
  nodeUrl: networks.infura_goerli.nodeUrl
});

log_green(`\n--== RpcProvider Methods ==--`);

log_green(`\n---=== getTransactionCount() ===---`);
const getTxCountResponse = await rpcProvider.getTransactionCount("0x4fa2a3081094401cba7ac4419cff1adbc2bf03f413a8bf6c121f36a9b52fa3f");
console.log(getTxCountResponse, "\n");

log_green(`\n---=== getBlockNumber() ===---`);
const getBlockNumberResponse = await rpcProvider.getBlockNumber();
console.log(getBlockNumberResponse, "\n");

log_green(`\n---=== getSyncingStats() ===---`);
const getSyncingStatsResponse = await rpcProvider.getSyncingStats();
console.log(getSyncingStatsResponse, "\n");

log_green(`\n---=== getEvents() ===---`);
const getEventsResposne = await rpcProvider.getEvents({
  fromBlock: 279000,
  toBlock: 279782,
  page_size: 5,
  page_number: 0
});
console.log(getEventsResposne, "\n");
