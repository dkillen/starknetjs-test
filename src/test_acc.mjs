import fs from 'fs';
import path from 'path';
import {
  Account, 
  ec, 
  json, 
  number,
  Provider
} from 'starknet';
import config from "../config.js"

const networks = config.networks;

const accountsFilePath = path.join(process.cwd(), "starknet-accounts", "accounts.json");

const accounts = json.parse(fs.readFileSync(accountsFilePath, 'ascii'));
const privateKey = accounts.networks['alpha_goerli'].accounts[0].private_key;
const account_address = accounts.networks['alpha_goerli'].accounts[0].address;
const starkKeyPair = ec.getKeyPair(privateKey);

const provider = new Provider({
  sequencer: {
    baseUrl: networks.testnet.baseUrl
  }
});

const account = new Account(
  provider,
  account_address,
  starkKeyPair
);

console.log(`Private Key: 0x${starkKeyPair.getPrivate("hex")}`);
console.log(`Public Key:  ${ec.getStarkKey(starkKeyPair)}`);