require('dotenv').config();

const INFURA_API_KEY = process.env.STARKNET_INFURA_API_KEY;
const ALCHEMY_API_KEY = process.env.STARKNET_ALCHEMY_API_KEY;

module.exports = {
  networks: {
    testnet: {
      networkId: "goerli",
      baseUrl: "https://alpha4.starknet.io",
      feederGatewayUrl: "feeder_gateway",
      gatewayUrl: "gateway",
      voyagerUrl: "https://beta-goerli.voyager.online"
    },
    infura_goerli: {
      networkId: "goerli",
      nodeUrl: `https://starknet-goerli.infura.io/v3/${INFURA_API_KEY}`,
      voyagerUrl: "https://goerli.voyager.online"
    },
    alchemy_goerli: {
      nodeUrl: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    },
    mainnet:{
      networkId: "mainnet",
      baseUrl: "https://alpha-mainnet.starknet.io",
      feederGatewayUrl: "feeder_gateway",
      gatewayUrl: "gateway",
      voyagerUrl: "https://beta-voyager.online/"
    },
    devnet: {
      networkId: "devnet",
      baseUrl: "http://127.0.0.1:5050",
      feederGatewayUrl: "feeder_gateway",
      gatewayUrl: "gateway",
      voyagerUrl: "null"
    }
  }
}
