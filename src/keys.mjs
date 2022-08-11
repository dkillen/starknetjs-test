import fs from 'fs';
import path from 'path';
import {
  Account,
  Contract,
  ec,
  json,
  number,
  Provider, SequencerProvider,
  Signer,
  uint256
} from 'starknet';
import config from "../config.js"

const networks = config.networks;

const contractAbiFilePath = path.join(process.cwd(), "build", "abi", "ERC20.json");
// const accountsFilePath = path.join(process.cwd(), "starknet-accounts", "accounts.json");

// const erc20Abi = json.parse(fs.readFileSync(contractAbiFilePath).toString("ascii"));
// const erc20Address = "0x26c09d9733f285be70359d3887b2ff3efcc67f0976ab7d3c86bb8080cb00247";

// Get account address and private key to generate a signer
// const accounts = json.parse(fs.readFileSync(accountsFilePath).toString("ascii"));
// const privateKey = accounts.networks['alpha_goerli'].accounts[0].privateKey;
// const account_address = accounts.networks['alpha_goerli'].accounts[0].address;

// Instantiate a signer from the account private key.
// const starkKeyPair = ec.getKeyPair(privateKey);
// const signer = new Signer(ec.getKeyPair(privateKey));

const provider = new SequencerProvider({
  baseUrl: networks.testnet.baseUrl
});

// console.log(`Initializing account - Account address: ${account_address}`);
// const account = new Account(
//   provider,
//   account_address,
//   signer
// );

const keyPair = ec.genKeyPair();

console.log(`Private Key: ${number.toHex(keyPair.getPrivate())}`);
console.log(`Public Key:  ${ec.getStarkKey(keyPair)}`);

const txStatusResponse = await provider.getTransactionStatus("0x460fb030f504d5b28d11961baf45d762e37a344e92c1efc85c02784f9507c77");
console.log(`Transaction status: `, txStatusResponse.tx_status);
 