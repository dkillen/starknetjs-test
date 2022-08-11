import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  Account, 
  defaultProvider,
  ec, 
  json, 
  number,
  Provider,
  shortString,
  uint256
} from 'starknet';
dotenv.config();

import config from "../config.js"

// const network = config.networks.testnet;
const networks = config.networks;

const compiledContracFilePath = path.join(process.cwd(), "build", "ERC20.json");
const accountsFilePath = path.join(process.cwd(), "starknet-accounts", "accounts.json");
// const deploymentsFilePath = path.join(process.cwd(), "deployment", "ERC20.json");

console.log("Reading ERC20 Contract...");
const compiledContract = fs.readFileSync(compiledContracFilePath, 'ascii');

const accounts = json.parse(fs.readFileSync(accountsFilePath, 'ascii'));
const privateKey = accounts.networks['alpha_goerli'].accounts[0].privateKey;
const account_address = accounts.networks['alpha_goerli'].accounts[0].address;
const starkKeyPair = ec.getKeyPair(privateKey);

const provider = new Provider({
  // rpc: {
  //   nodeUrl: networks.infura_goerli.nodeUrl
  // }
  sequencer: {
    baseUrl: networks.testnet.baseUrl,
  }
});

const account = new Account(
  provider,
  account_address,
  starkKeyPair
);

// Contract constructor arguments
// name, symobl & contract owner: felt
const tokenName = number.hexToDecimalString(shortString.encodeShortString("Test Token A"));
const tokenSymbol = number.hexToDecimalString(shortString.encodeShortString("TTa"));
const ownerAddress = account_address;
// initial_supply : Uint256 & recipient address
const initialSupplyValue = "1000";
const initialSupply = uint256.bnToUint256(initialSupplyValue + "000000000000000000");
const recipientAddress = account_address;

// Deploy ERC20 contract
console.log(`Deployment tx - ERC20 Contract to StarkNet`);
const deployContractResponse = await account.deployContract({
  contract: compiledContract,
  constructorCalldata: [
    tokenName,
    tokenSymbol,
    ownerAddress, 
    initialSupply.low,
    initialSupply.high,
    recipientAddress
  ]
});

// Wait for the deployment transaction to be accepted on StarkNet
console.log("Waiting for Tx to be Accepted on Starknet - ERC20 Deployment...");
await defaultProvider.waitForTransaction(deployContractResponse.transaction_hash);
console.log(`Deployment Tx - Transaction Hash: ${deployContractResponse.transaction_hash}\n`);
console.log(`Contract successfully deployed.\n`);

// Get the erc20 contract address
console.log(`Deployment Tx - Contract Address: ${deployContractResponse.contract_address}`);
console.log(`View contract on StarkNet Voyager: ${networks.testnet.voyagerUrl}/contract/${deployContractResponse.contract_address}`);

// const deploymentsJson = JSON.parse(fs.readFileSync(deploymentsFilePath, 'utf-8'));
// const deployment = {
//   block_number: `${transaction.block_number}`,
//   compiled_contract: compiledContracFilePath,
//   contract_abi: contractAbiFilePath,
//   constructor_arguments: [
//     tokenName, 
//     tokenSymbol, 
//     ownerAddress, 
//     initialSupply, 
//     recipientAddress
//   ],
//   tx_hash: deployContractResponse.transaction_hash,
//   contract_address: erc20Address
// }
// deploymentsJson.networks.alpha_goerli.deployments.push(deployment);
// fs.writeFileSync(deploymentsFilePath, JSON.stringify(deploymentsJson));
