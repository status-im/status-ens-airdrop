const hre = require("hardhat");
const MT = require('merkletreejs')
const MerkleTree = require('../../lib/merkleTree')

async function main() {
  const tree = new MerkleTree(data);
  console.log(" root:", tree.getRoot());
  const leaf = tree.hashItem(data[0]);
  console.log(" leaf:", leaf.toString("hex"))
  const proof = tree.getProof(leaf);
  console.log("proof:", tree.tree.getHexProof(leaf));
  console.log(tree.verify(proof, leaf))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
