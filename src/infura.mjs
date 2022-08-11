import dotenv from 'dotenv';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import {Account, ec, json, number, RpcProvider, shortString, uint256} from 'starknet';

dotenv.config()

const log_green = (output) => {
  console.log(chalk.green(output));
}

const executeComplete = true;

// Network configuration
import config from "../config.js"
const networks = config.networks;

const rpcProvider = new RpcProvider({
  nodeUrl: networks.infura_goerli.nodeUrl
});

log_green(`---=== Setting up ===---\n`);

const compiledContractFilePath = path.join(process.cwd(), "build", "ERC20.json");
const contractAbiFilePath = path.join(process.cwd(), "build", "abi", "ERC20.json");
const compiledContract = json.parse(fs.readFileSync(compiledContractFilePath, 'ascii'));
const erc20Abi = fs.readFileSync(contractAbiFilePath).toString("ascii");

const account_address = process.env.STARKNET_ACCOUNT_ADDRESS;
const privateKey = process.env.STARKNET_ACCOUNT_PRIVATE_KEY;
const contractAddress = "0x4f15b569f2c5528fecaa291ffea3029c1b21f2a6360a0f3b9827bd1596d21c2";
const tx_hash = "0x331519c15115b5d7e04023523ac49fe309ffb7e94136c462615b9ab243821ad";
const blockIdentifier = "0x4fa2a3081094401cba7ac4419cff1adbc2bf03f413a8bf6c121f36a9b52fa3f";

log_green(`ERC20 Contract Address: ${contractAddress}`);
log_green(`Account Contract Address: ${account_address}`);
log_green(`Account Private Key: ${privateKey}`);
log_green(`Transaction Hash: ${tx_hash}`);
log_green(`Block Identifier: ${blockIdentifier}`);

// Get key pair from private key
const keyPair = ec.getKeyPair(privateKey);
log_green(`\nInitializing account - Account address: ${account_address}`);
const account = new Account(
  rpcProvider,
  account_address,
  keyPair
);

log_green(`\n--== Infura Supported RpcProvider Methods ==--`);

if (executeComplete) {
  log_green(`\n---=== getBlock() ===---`);
  const getBlockResponse = await rpcProvider.getBlock(blockIdentifier);
  console.log(getBlockResponse);

  log_green(`\n---=== getStorageAt() ===---`);
  console.log(`TODO: Add getStorageAt() example.\n`);

  log_green(`\n---=== getTransaction() ===---`);
  const getTxResponse = await rpcProvider.getTransaction(tx_hash);
  console.log(getTxResponse, "\n");

  log_green(`\n---=== getTransactionReceipt() ===---`);
  const getTxReceiptResponse = await rpcProvider.getTransactionReceipt(tx_hash);
  console.log(getTxReceiptResponse, "\n");

  log_green(`\n---=== getTransactionCount() ===---`);
  const getTxCountResponse = await rpcProvider.getTransactionCount(blockIdentifier);
  console.log(getTxCountResponse, "\n");

  log_green(`\n---=== getClassAt() ===---`);
  const getClassAtResponse = await rpcProvider.getClassAt(contractAddress);
  console.log(getClassAtResponse, "\n");

  log_green(`\n---=== getBlockNumber() ===---`);
  const getBlockNumberResponse = await rpcProvider.getBlockNumber();
  console.log(getBlockNumberResponse, "\n");

  log_green(`\n---=== chainId() ===---`);
  log_green(`Chain ID: ${rpcProvider.chainId}\n`);

  log_green(`\n---=== getSyncingStats() ===---`);
  const getSyncingStatsResponse = await rpcProvider.getSyncingStats();
  console.log(getSyncingStatsResponse, "\n");

  log_green(`\n---=== getEvents() ===---`);
  const getEventsResponse = await rpcProvider.getEvents({
    fromBlock: 279000,
    toBlock: 279782,
    page_size: 5,
    page_number: 0
  });
  console.log(getEventsResponse, "\n");

  log_green(`\n---=== declareContract() ===---`);
  const declareContractResponse = await account.declareContract({
    contract: compiledContract,
    version: "1"
  });
  log_green("Waiting for Tx to be Accepted on Starknet - Declare contract...");
  await rpcProvider.waitForTransaction(declareContractResponse.transaction_hash);
  console.log(declareContractResponse);

  log_green(`\n---=== deployContract() ===---`);
// Contract constructor arguments
// name, symbol & contract owner: felt
  const tokenName = shortString.encodeShortString("Test Token A");
  const tokenSymbol = shortString.encodeShortString("TTa");
  const ownerAddress = account_address;

  // initial_supply : Uint256 & recipient address
  const initialSupplyValue = "1000";
  const initialSupply = uint256.bnToUint256(initialSupplyValue + "000000000000000000");
  const recipientAddress = account_address;

  const callData = [
    tokenName,
    tokenSymbol,
    ownerAddress,
    initialSupply.low,
    initialSupply.high,
    recipientAddress
  ];

  const deployContractResponse = await account.deployContract({
    contract: compiledContract,
    constructorCalldata: callData
  });
  log_green("Waiting for Tx to be Accepted on Starknet - ERC20 Deployment...");
  await rpcProvider.waitForTransaction(deployContractResponse.transaction_hash);
  console.log(deployContractResponse);

  log_green(`\n---=== callContract() ===---`);
  const callContractResponse = await account.callContract({
    contractAddress: contractAddress,
    entrypoint: "balanceOf",
    calldata: [number.hexToDecimalString(account_address)]
  });
  console.log(callContractResponse.result);

  log_green(`\n---=== invokeFunction() ===---`);
  const mintValue = "1000";
  const value = uint256.bnToUint256(mintValue + "000000000000000000");

  const invocation = {
    contractAddress: contractAddress,
    entrypoint: "mint",
    calldata: [
      recipientAddress,
      value.low,
      value.high
    ]
  };

  const { overall_fee: overall_fee, suggestedMaxFee: maxFee } = await account.estimateFee(invocation);
  console.log(`Overall Fee (ETH): ${overall_fee / 10**18}`);
  console.log(`Suggested Max Fee (ETH): ${maxFee / 10**18}`);

  console.log(`Invoke Tx - Minting ${mintValue} tokens to ${recipientAddress}...`);
  const invokeFunctionResponse = await account.execute(
    invocation,
    [erc20Abi],
    {
      maxFee: maxFee
    }
  );

  log_green("Waiting for Tx to be Accepted on Starknet - Function invocation...");
  await rpcProvider.waitForTransaction(invokeFunctionResponse.transaction_hash);
  console.log(invokeFunctionResponse);
} // executeComplete == TRUE
