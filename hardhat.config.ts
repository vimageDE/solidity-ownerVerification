import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import '@primitivefi/hardhat-marmite';
import { HardhatUserConfig, task } from 'hardhat/config';
require('dotenv').config();

const baseConfig: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {},
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
    // gasPrice: 100,
    enabled: process.env.REPORT_GAS === 'true',
    excludeContracts: [],
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: 'MATIC',
  },
  mocha: {
    timeout: 100000,
  },
};

const networks = () => {
  if (process.env.ENV === 'dev') {
    return {
      ...baseConfig.networks,
      sepolia: {
        url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_TOKEN,
        chainId: 11155111,
        accounts: {
          mnemonic: process.env.MNEMONIC_DEV as string,
        },
      },
      local: {
        url: 'http://127.0.0.1:7545',
        accounts: {
          mnemonic: process.env.MNEMONIC_DEV_LOCAL as string,
        },
      },
    };
  } else if (process.env.ENV === 'prod') {
    return {
      ...baseConfig.networks,
      mainnet: {
        url: 'https://mainnet.infura.io/v3/' + process.env.INFURA_TOKEN,
        accounts: {
          mnemonic: process.env.MNEMONIC as string,
        },
      },
    };
  }
  return baseConfig.networks;
};

const config: HardhatUserConfig = {
  ...baseConfig,
  networks: networks(),
  etherscan: !process.env.ETHERSCAN_TOKEN ? {} : { apiKey: process.env.ETHERSCAN_TOKEN },
};

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

export default config;
