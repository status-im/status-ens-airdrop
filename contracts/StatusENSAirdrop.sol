//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "hardhat/console.sol";

contract StatusENSAirdrop {
  event Claimed(uint256 index, address account, uint256 amount);

  address public immutable ENS = 0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72;
  bytes32 public immutable merkleRoot;

  mapping(uint256 => uint256) private claimedBitMap;

  constructor(bytes32 _merkleRoot) {
    merkleRoot = _merkleRoot;
  }

  function isClaimed(uint256 index) public view returns (bool) {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    uint256 claimedWord = claimedBitMap[claimedWordIndex];
    uint256 mask = (1 << claimedBitIndex);
    return claimedWord & mask == mask;
  }

  function _setClaimed(uint256 index) private {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
  }

  function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external {
    require(!isClaimed(index), 'MerkleDistributor: Drop already claimed.');

    // Verify the merkle proof.
    bytes32 node = keccak256(abi.encodePacked(index, account, amount));
    require(MerkleProof.verify(merkleProof, merkleRoot, node), 'StatusENSAirdrop: Invalid proof.');

    // Mark it claimed and send the token.
    _setClaimed(index);
    require(IERC20(ENS).transfer(account, amount), 'StatusENSAirdrop: Transfer failed.');

    emit Claimed(index, account, amount);
  }
}
