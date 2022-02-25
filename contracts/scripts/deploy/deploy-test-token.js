const hre = require("hardhat");
const { prompt } = require("../../lib/utils");

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = await hre.network.name;

  const [account] = await ethers.getSigners();
  const accountBalance = await ethers.provider.getBalance(account.address);

  console.log(`chainId: ${network.chainId}`);
  console.log(`network: ${networkName} (from ethers: ${network.name})`);
  console.log(`account: ${account.address}`);
  console.log("account balance:", accountBalance.toString(), "(", ethers.utils.formatEther(accountBalance), ")");
  await prompt("do you want to deploy the TestERC20 contract?");

  const TestERC20 = await hre.ethers.getContractFactory("TestERC20");
  const testERC20 = await TestERC20.deploy();
  await testERC20.deployed();
  console.log("TestERC20 deployed to:", testERC20.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
