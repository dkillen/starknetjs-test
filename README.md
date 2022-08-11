# Dave's StarkNet.js Playground

Just a place for me to play with StarkNet.js


**DISCLAIMER: There is no guarantee that any code in this repository is correct or even works. Use it entirely at your own risk. No responsibility is taken for any inadvertent distribution of your private keys or any loss of any funds 
that may result from using this code. Ensuring that your funds and private keys are safe is solely your responsibility.**

## Environment

You will need to create a `.env` file to store important information. This file should be created in the project's root directory:

```bash
touch .env
```

The scripts will look for the following environment variables in the `.env` file:

```bash
STARKNET_INFURA_API_KEY=""
STARKNET_ALCHEMY_API_KEY=""
STARKNET_ACCOUNT_ADDRESS=""
STARKNET_ACCOUNT_PRIVATE_KEY=""
```

Be sure to add your own API keys and Account address & private key.

## Accounts

Some of the scripts here, such as `deploy_account.mjs`, will persist account details to and retrieve them from from the `accounts.json` file located in `./starknet-accounts` directory. If you don't wish to use the `acccounts.json` file to store and retrieve account details, you can just replace its use in the code with your preferred method.

The `accounts.json` has the following shape:

```json
{
  "networks": {
    "alpha_goerli": {
      "accounts": [
        {
          "name": "Account 1",
          "address": [ACCOUNT_ADDRESS],
          "private_key": [ACCOUNT_PRIVATE_KEY],
          "public_key": [ACCOUNT_PUBLIC_KEY],
          "block_explorer_url": [BLOCK_EXPLORER_URL]
        }
      ]
    }
  }
}
```
where BLOCK_EXPLORER_URL is the URL for the account contract on StarkNet Voyager. For contracts, this URL has the form: `https://beta-goerli.voyager.online/contract/[CONTRACT_ADDRESS]`

You will need to create this directory and file first. From the projects root directory:

```bash
mkdir starknet-accounts
touch starknet-accounts/accounts.json
```

Edit the `accounts.json` file with your preferred editor and paste in the following: 

```json
{
  "networks": {
    "alpha_goerli": {
      "accounts": []
    }
  }
}
```

As you will note, the `accounts.json` file separates deployed account contracts by StarkNet network.

You will also need to fund your StarkNet account so that transaction fees can be paid. You can use the [StarkNet Goerli faucet](https://faucet.goerli.starknet.io/) to get a small amount of testnet ETH.