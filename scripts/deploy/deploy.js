const hre = require("hardhat");

async function main() {
  const merkleRoot = "0x...";
  const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");

  const contract = await StatusENSAirdrop.deploy(merkleRoot);
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
