import MT from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import { global } from './global';

interface ClaimItem {
  index: number
  address: string
  amount: string
}

class MerkleTree {
  private tree;

  constructor(items: ClaimItem[]) {
    const hashedItems = items.map(this.hashItem);
    this.tree = new MT(hashedItems, keccak256, { sort: true });
  }

  getRoot() {
    return this.tree.getHexRoot();
  }

  getProof(leaf: Buffer) {
    return this.tree.getHexProof(leaf);
  }

  verify(proof: any, leaf: string) {
    return this.tree.verify(proof, leaf, this.getRoot());
  }

  hashItem(item: ClaimItem): Buffer {
    const hash = global.web3!.utils.keccak256(
      global.web3!.eth.abi.encodeParameters(["uint256", "address", "uint256"], [item.index, item.address, item.amount])
    )
    return Buffer.from(hash.substr(2), "hex");
  }
}

export default MerkleTree;
