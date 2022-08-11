import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  Account, 
  ec, 
  json, 
  number,
  Provider,
  uint256
} from 'starknet';
dotenv.config();

// Network configuration
import config from "../config.js"
// const network = config.networks.testnet;
const networks = config.networks;

// File paths
const contractAbiFilePath = path.join(process.cwd(), "build", "abi", "ERC20.json");
const accountsFilePath = path.join(process.cwd(), "starknet-accounts", "accounts.json");

// ABIs
const erc20Abi = json.parse(fs.readFileSync(contractAbiFilePath).toString("ascii"));

// Get account address and private key to generate a signer
const accounts = json.parse(fs.readFileSync(accountsFilePath, "ascii"));
const privateKey = accounts.networks['alpha_goerli'].accounts[0].private_key;
const account_address = accounts.networks['alpha_goerli'].accounts[0].address;

// ERC20 Contract address
const erc20Address = "0x4f15b569f2c5528fecaa291ffea3029c1b21f2a6360a0f3b9827bd1596d21c2";

console.log(`ERC20 Contract Address: ${erc20Address}`);
console.log(`Account Contract Address: ${account_address}`);
console.log(`Account Private Key: ${privateKey}`);

// Get key pair from private key
const keyPair = ec.getKeyPair(privateKey);

// Instantiate a new Provider
const provider = new Provider({
  // rpc: {
  //   nodeUrl: networks.infura_goerli.nodeUrl
  // }
  sequencer: {
    baseUrl: networks.testnet.baseUrl,
  }
});

console.log(`Initializing account - Account address: ${account_address}`);
const account = new Account(
  provider,
  account_address,
  keyPair
);

// Mint 1000 tokens to account address
const mintValue = "1000";
const value = uint256.bnToUint256(mintValue + "000000000000000000");
const recipientAddress = account_address;

const call = {
  contractAddress: erc20Address,
  entrypoint: "mint",
  calldata: [
    recipientAddress,
    value.low,
    value.high
  ]
};


const { overall_fee: fee, suggestedMaxFee: maxFee } = await account.estimateFee(call);
console.log(`Estimated Fee (ETH): ${fee / 10**18}`);
console.log(`Suggested Max Fee (ETH): ${maxFee / 10**18}`);

console.log(`Invoke Tx - Minting ${mintValue} tokens to ${recipientAddress}...`);
const { transaction_hash: txHash } = await account.execute(
  call,
  [erc20Abi], 
  { 
    maxFee: maxFee
  }
);

// Wait for the invoke transaction to be accepted on StarkNet
console.log(`Waiting for Tx to be Accepted on Starknet - Minting...`);
await provider.waitForTransaction(txHash);
console.log(`View transaction on StarkNet Voyager: ${networks.testnet.voyagerUrl}/tx/${txHash}`);
