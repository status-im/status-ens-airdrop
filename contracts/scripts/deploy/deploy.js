const hre = require("hardhat");
const { prompt } = require("../../lib/utils");
const allConfig = require("../../lib/config");

const MERKLE_ROOT = undefined;

async function main() {
  const network = await ethers.provider.getNetwork();
  const config = allConfig[network.name]

  const isLocalNetwork = network.chainId === 31337;
  let testERC20;
  let token = config?.token;

  const [account] = await ethers.getSigners();
  const accountBalance = await ethers.provider.getBalance(account.address);

  if (MERKLE_ROOT === undefined) {
    console.log("change the value of the MERKLE_ROOT constant and run again.");
    process.exit(1);
  }

  if (isLocalNetwork) {
    testERC20 = await deployTestERC20();
    token = testERC20.address;
  }

  console.log(`chainId: ${network.chainId}`);
  console.log(`network: ${network.name}`);
  console.log(`account: ${account.address}`);
  console.log(`token: ${token}`);
  console.log("account balance:", accountBalance.toString(), "(", ethers.utils.formatEther(accountBalance), ")");
  console.log(`MERKLE_ROOT: ${MERKLE_ROOT}`);
  await prompt("do you want to deploy the StatusENSAirdrop contract?");

  const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");
  const contract = await StatusENSAirdrop.deploy(MERKLE_ROOT, token);
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
