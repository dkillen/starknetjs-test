import dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {
  Account,
  ContractFactory,
  ec,
  json, 
  number,
  Provider,
  shortString,
  stark,
  uint256
} from 'starknet';
dotenv.config();

const log_green = (output) => {
  console.log(chalk.green(output));
} 

import config from "../config.js"

// const network = config.networks.testnet;
const networks = config.networks;

const compiledContracFilePath = path.join(process.cwd(), "build", "ERC20.json");
const contractAbiFilePath = path.join(process.cwd(), "build", "abi", "ERC20.json");

console.log("Reading ERC20 Compiled Contract and ABI...");
const compiledContract = json.parse(fs.readFileSync(compiledContracFilePath, 'ascii'));

const account_address = process.env.STARKNET_ACCOUNT_ADDRESS;
const privateKey = process.env.STARKNET_ACCOUNT_PRIVATE_KEY;
const starkKeyPair = ec.getKeyPair(privateKey);

const provider = new Provider({
  // rpc: {
  //   nodeUrl: networks.infura_goerli.nodeUrl
  // }
  sequencer: {
    baseUrl: networks.testnet.baseUrl,
  }
});

log_green(`\n---=== declareContract() ===---`);
const declareResponse = await provider.declareContract({
  contract: compiledContract,
  version: "2" // increment this
});
console.log("Waiting for Tx to be Accepted on Starknet - ERC20 Declare...");
await provider.waitForTransaction(declareResponse.transaction_hash);
log_green(`Transaction Hash: ${declareResponse.transaction_hash}`);
log_green(`Contract Class Hash: ${declareResponse.class_hash}`);

// Contract constructor arguments
// name, symobl & contract owner: felt
const tokenName = number.hexToDecimalString(shortString.encodeShortString("Test Token A"));
const tokenSymbol = number.hexToDecimalString(shortString.encodeShortString("TTa"));
const ownerAddress = account_address;
// initial_supply : Uint256 & recipient address
const initialSupplyValue = "1000";
const initialSupply = uint256.bnToUint256(initialSupplyValue + "000000000000000000");
const recipientAddress = ownerAddress;

log_green("ContractFactory - Instantiating ContractFactory...");
const factory = new ContractFactory(compiledContract, provider);

log_green("ContractFactory - Deploying contract...");
const deployedContract = await factory.deploy([
  tokenName,
  tokenSymbol,
  ownerAddress,
  initialSupply.low,
  initialSupply.high,
  recipientAddress
]);

log_green("Waiting for Tx to be Accepted on Starknet - ERC20 Deployment...");
await provider.waitForTransaction(deployedContract.deployTransactionHash);
log_green(`Deployment Tx - Transaction Hash: ${deployedContract.deployTransactionHash}\n`);
log_green(`Contract successfully deployed.\n`);