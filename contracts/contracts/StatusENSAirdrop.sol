//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract StatusENSAirdrop {
  event Claimed(uint256 index, address account, uint256 amount);

  address public immutable token;
  bytes32 public immutable merkleRoot;

  mapping(uint256 => uint256) private claimedBitMap;

  constructor(bytes32 _merkleRoot, address _token) {
    merkleRoot = _merkleRoot;
    token = _token;
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
    require(!isClaimed(index), 'StatusENSAirdrop: Drop already claimed.');

    // Verify the merkle proof.
    bytes32 node = keccak256(abi.encodePacked(index, account, amount));
    require(MerkleProof.verify(merkleProof, merkleRoot, node), 'StatusENSAirdrop: Invalid proof.');

    // Mark it claimed and send the token.
    _setClaimed(index);
    require(IERC20(token).transfer(account, amount), 'StatusENSAirdrop: Transfer failed.');

    emit Claimed(index, account, amount);
  }
}
