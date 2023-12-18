require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const { SEPOLIA_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.22",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/B_1X9LJCdxR_7ezRawZBWDZ7Axmq0MHX",
      accounts: [
        "0x75bf9c651fed7dfc51611500087111bfb99d53147a3b2d65d709cc8f2d6c566a",
      ],
    },
  },
};
