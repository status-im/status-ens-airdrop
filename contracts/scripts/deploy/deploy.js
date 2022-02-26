const hre = require("hardhat");
const { prompt } = require("../../lib/utils");
const allConfig = require("../../lib/config");

async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = await hre.network.name;
  const config = allConfig[networkName]

  const [account] = await ethers.getSigners();
  const accountBalance = await ethers.provider.getBalance(account.address);

  if (config.merkleRoot === undefined) {
    console.log("change the value of the merkleRoot in the config file and run again.");
    process.exit(1);
  }

  console.log(`chainId: ${network.chainId}`);
  console.log(`network: ${networkName} (from ethers: ${network.name})`);
  console.log(`account: ${account.address}`);
  console.log(`token: ${config.token}`);
  console.log("account balance:", accountBalance.toString(), "(", ethers.utils.formatEther(accountBalance), ")");
  console.log(`merkleRoot: ${config.merkleRoot}`);
  await prompt("do you want to deploy the StatusENSAirdrop contract?");

  const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");
  const contract = await StatusENSAirdrop.deploy(config.merkleRoot, config.token);
  await contract.deployed();
  console.log("StatusENSAirdrop deployed to:", contract.address);
}

async function deployTestERC20() {
  console.log();
  console.log("deploying TestERC20");
  const TestERC20 = await hre.ethers.getContractFactory("TestERC20");
  const testERC20 = await TestERC20.deploy();
  await testERC20.deployed();
  console.log("TestERC20 deployed to:", testERC20.address);
  console.log();
  return testERC20;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
