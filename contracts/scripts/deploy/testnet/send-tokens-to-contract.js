const hre = require("hardhat");
const { prompt, BN, erc20Utils } = require("../../../lib/utils");
const allConfig = require("../../../lib/config");

const tokenUtils = erc20Utils(18);
const amountToSend = tokenUtils.fromUnits(100_000);

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = await hre.network.name;
  const config = allConfig[networkName]

  const [account] = await ethers.getSigners();
  const accountBalance = await ethers.provider.getBalance(account.address);

  const token = await hre.ethers.getContractAt("TestERC20", config.token);
  const tokenSym = await token.symbol();
  const accountTokenBalance = await token.balanceOf(account.address);

  console.log(`chainId: ${network.chainId}`);
  console.log(`network: ${networkName} (from ethers: ${network.name})`);
  console.log(`account: ${account.address}`);
  console.log(`contract: ${config.contract}`);
  console.log("account balance:", accountBalance.toString(), "(", ethers.utils.formatEther(accountBalance), ")");
  console.log("account token balance:", accountTokenBalance.toString(), "(", ethers.utils.formatEther(accountTokenBalance), ")");
  await prompt(`do you want to send ${tokenSym} tokens to the contract (${config.contract})?`);

  await token.transfer(config.contract, amountToSend);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
