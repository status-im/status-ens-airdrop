const hre = require("hardhat");
const { prompt } = require("../../lib/utils");

const MERKLE_ROOT = undefined;

async function main() {
  const network = await ethers.provider.getNetwork();
  const [account] = await ethers.getSigners();
  const accountBalance = await ethers.provider.getBalance(account.address);

  if (MERKLE_ROOT === undefined) {
    console.log("change the value of the MERKLE_ROOT constant and run again.");
    process.exit(1);
  }

  console.log(`chainId: ${network.chainId}`);
  console.log(`network: ${network.name}`);
  console.log(`account: ${account.address}`);
  console.log("account balance:", accountBalance.toString(), "(", ethers.utils.formatEther(accountBalance), ")");
  console.log(`MERKLE_ROOT: ${MERKLE_ROOT}`);
  await prompt("do you want to deploy the StatusENSAirdrop contract?");

  const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");

  const contract = await StatusENSAirdrop.deploy(MERKLE_ROOT);
  await contract.deployed();
  console.log("StatusENSAirdrop deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
