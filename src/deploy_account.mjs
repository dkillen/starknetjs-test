import fs from 'fs';
import path from 'path';
import {
  defaultProvider, 
  ec, 
} from 'starknet';
import config from "../config.js"

const testNetwork = config.networks.testnet;
const compiledAccountContractPath = path.join(process.cwd(), 'build', 'Account.json');
const accountsFilePath = path.join(process.cwd(), 'starknet-accounts', 'accounts.json');

// Read in the compiled Account contract
console.log("Reading OpenZeppelin Account Contract...");
const compiledAccountContract = fs.readFileSync(compiledAccountContractPath, 'ascii');

// Generate a public and private key pair
console.log("Generating Key Pair...");
const keyPair = ec.genKeyPair();
const publicKey = ec.getStarkKey(keyPair);

// Deploy the account contract and wait for it to be accepted on StarkNet 
console.log(`Deployment Tx - Account Contract to StarkNet...`);
const accountResponse = await defaultProvider.deployContract({
  contract: compiledAccountContract,
  constructorCalldata: [publicKey],
  addressSalt: publicKey
});

console.log(`Waiting for tx to be accepted on StarkNet - Account deployment...`);
await defaultProvider.waitForTransaction(accountResponse.transaction_hash);
console.log(`Deployment tx - Transaction Hash: ${accountResponse.transaction_hash}\n`);
console.log(`Account Address: ${accountResponse.contract_address}\nView account on StarkNet Voyager: ${testNetwork.voyagerUrl}/contract/${accountResponse.contract_address}`);
const privateKey = `0x${keyPair.getPrivate("hex")}`;
console.log(`\nAcount Private Key: ${privateKey}`);
console.log(`Account Public Key: ${publicKey}\n`);

// Save our new account to our accounts JSON file
let accountsJson = JSON.parse(fs.readFileSync(accountsFilePath, 'ascii'));
const numAccounts = accountsJson.networks.alpha_goerli.accounts.length;
const newAccount = {
  name: `Account ${numAccounts + 1}`,
  address: accountResponse.contract_address,
  private_key: privateKey,
  public_key: publicKey,
  block_explorer_url: `${testNetwork.voyagerUrl}/contract/${accountResponse.contract_address}`
}
accountsJson.networks.alpha_goerli.accounts.push(newAccount);
fs.writeFileSync(accountsFilePath, JSON.stringify(accountsJson));
