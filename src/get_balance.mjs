import dotenv from 'dotenv';
import {
  Account,
  ec,
  number,
  SequencerProvider,
} from 'starknet';
dotenv.config();

import config from "../config.js";

// Get the StarkNet configuration
const networks = config.networks;

// Get account address and key pair
const account_address = process.env.STARKNET_ACCOUNT_ADDRESS;
const privateKey = process.env.STARKNET_ACCOUNT_PRIVATE_KEY;
const starkKeyPair = ec.getKeyPair(privateKey);

const erc20Address = "0x4f15b569f2c5528fecaa291ffea3029c1b21f2a6360a0f3b9827bd1596d21c2";
console.log(`Contract Address: ${erc20Address}`);

// Instantiate a provider object
const provider = new SequencerProvider({
  baseUrl: networks.testnet.baseUrl
});

// Instantiate an account object with the provider
const account = new Account(
  provider,
  account_address,
  starkKeyPair
);

console.log(`Invoke Tx - Getting balance for address:  ${account_address}`);
const callContractResponse = await account.callContract({
  contractAddress: erc20Address,
  entrypoint: "balanceOf",
  calldata: [number.hexToDecimalString(account_address)]
});

console.log(callContractResponse.result);
