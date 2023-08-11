require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "goerli",
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/9ybBKXxKXavhmRHiRfyFKadWduiFeTCG",
      accounts: [
        "dbf49f37541b91dfa47090600c9f804e60ae455250a58304a020fafe186e97da",
      ],
    },
  },
};
