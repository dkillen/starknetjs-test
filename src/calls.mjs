import dotenv from 'dotenv'
import chalk from 'chalk';
import {
  Provider,
  RpcProvider,
  SequencerProvider
} from 'starknet';
dotenv.config();

const log_green = (output) => {
  console.log(chalk.green(output));
} 

// Network configuration
import config from "../config.js"
const networks = config.networks;

const provider = new Provider();

const sequencerProvider = new SequencerProvider({
  baseUrl: networks.testnet.baseUrl
});

const rpcProvider = new RpcProvider({
  nodeUrl: networks.infura_goerli.nodeUrl
});

// Goerli
const tx_hash = "0x65b44abd6b5e94d5deebc204689ae95d03ce13a4f73e5bd8210f018c7d0c8a3";

log_green(`--== Provider and SequencerProvider Methods ==--`);

log_green(`\n---=== chainId() ===---`);
log_green(`Chain ID: ${sequencerProvider.chainId}\n`);

log_green(`\n---=== getBlock() ===---`);
const blockIdentifier = "0x4fa2a3081094401cba7ac4419cff1adbc2bf03f413a8bf6c121f36a9b52fa3f";
const getBlockResponse = await sequencerProvider.getBlock(blockIdentifier);
console.log(getBlockResponse);

log_green(`\n---=== getClassAt() ===---`);
const contractAddress = "0x0396fD5a266E97AdEb75c2fdE397b746a64EeCe8476966Da8B96b58dd37016bC";
const getClassAtResponse = await sequencerProvider.getClassAt(contractAddress);
console.log(getClassAtResponse.abi, "\n");

log_green(`\n---=== getTransactionReceipt() ===---`);
const getTxReceiptResponse = await sequencerProvider.getTransactionReceipt(tx_hash);
console.log(getTxReceiptResponse, "\n");

log_green(`\n---=== getTransaction() ===---`);
const getTxResponse = await sequencerProvider.getTransaction(tx_hash);
console.log(getTxResponse, "\n");

log_green(`\n---=== getContractAddresses() ===---`);
const getContractAddresesResponse = await sequencerProvider.getContractAddresses();
console.log(getContractAddresesResponse, "\n")

log_green(`\n---=== getTransactionStatus() ===---`);
let getTxStatusResponse = await sequencerProvider.getTransactionStatus(tx_hash);
console.log(getTxStatusResponse, "\n");

log_green(`\n---=== getTransactionTrace() ===---`);
const getTxTraceResponse = await sequencerProvider.getTransactionTrace(tx_hash);
console.log(getTxTraceResponse);

log_green(`\n--== RpcProvider Methods ==--`);

log_green(`\n---=== getTransactionCount() ===---`);
const getTxCountResponse = await rpcProvider.getTransactionCount(blockIdentifier);
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
