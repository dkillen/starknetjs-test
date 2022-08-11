import chalk from 'chalk';
import { SequencerProvider } from 'starknet';

const log_green = (output) => {
  console.log(chalk.green(output));
}

// Network configuration
import config from "../config.js"
const networks = config.networks;

const sequencerProvider = new SequencerProvider({
  baseUrl: networks.testnet.baseUrl
});

// Goerli
const tx_hash = "0x65b44abd6b5e94d5deebc204689ae95d03ce13a4f73e5bd8210f018c7d0c8a3";

log_green(`--== SequencerProvider Methods ==--`);

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
