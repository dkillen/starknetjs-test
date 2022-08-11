import dotenv from 'dotenv';
import {
  defaultProvider, 
  number
} from 'starknet';
dotenv.config();

const address = process.env.STARKNET_ACCOUNT_ADDRESS;
const contractAddress = "0x4f15b569f2c5528fecaa291ffea3029c1b21f2a6360a0f3b9827bd1596d21c2";

const { result: tx_result } = await defaultProvider.callContract(
  {
    contractAddress: contractAddress,
    entrypoint: "balanceOf",
    calldata: [
      number.hexToDecimalString(address)
    ]
  }
);
console.log(number.hexToDecimalString(tx_result[0]));
