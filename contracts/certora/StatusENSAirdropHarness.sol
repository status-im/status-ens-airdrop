import "../contracts/StatusENSAirdrop.sol";

contract StatusENSAirdropHarness is StatusENSAirdrop {
  constructor(bytes32 _merkleRoot, address _token)
    StatusENSAirdrop(_merkleRoot, _token)
  {
  }

  function _verify(uint256 index, address account, uint256 amount, bytes32[] calldata proof)
    public view
    returns (bool)
  {
    return MerkleProof.verify(proof, encode(index, account, amount), merkleRoot);
  }
  
  function encode(uint256 index, address account, uint256 amount)
    public pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(index, account, amount));
  }
}

