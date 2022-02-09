const MT = require('merkletreejs')
const keccak256 = require('keccak256')

class MerkleTree {
  constructor(items) {
    const hashedItems = items.map(this.hashItem);
    this.tree = new MT.MerkleTree(hashedItems, keccak256, { sort: true });
  }

  getRoot() {
    return this.tree.getHexRoot();
  }

  getProof(leaf) {
    return this.tree.getHexProof(leaf);
  }

  verify(proof, leaf) {
    return this.tree.verify(proof, leaf, this.getRoot());
  }

  hashItem(item) {
    const hash = ethers.utils.solidityKeccak256(["uint256", "address", "uint256"], [item.index, item.address, item.amount]);
    return Buffer.from(hash.substr(2), "hex");
  }
}

module.exports = MerkleTree;
