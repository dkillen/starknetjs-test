import { number, shortString } from "starknet";

// Convert our felt to a BN ready for conversion to hex
const felt1 = number.toBN("93660251291570391273399662");
const felt2 = number.toBN("332211180641");

// Convert the BN to hex ready for conversion to a string
const hex1 = number.toHex(felt1);
const hex2 = number.toHex(felt2);

console.log(hex1);
console.log(hex2);

// Convert the hex to the string it represents.
const str1 = shortString.decodeShortString(hex1);
const str2 = shortString.decodeShortString(hex2);

console.log(str1);
console.log(str2);
