using TestERC20 as token

methods {
    // declaring methods envfree means we don't need to pass an environment arg
    isClaimed(uint256) returns bool envfree;
    token.balanceOf(address) returns uint256 envfree;
}

/* ghost mathint unclaimed_merkle_funds; 

hook Sstore claimedBitMap[KEY uint256 index] uint256 bitmap (uint256 old_bitmap) STORAGE {
    // can't actually update ghost because we don't know what the amount of the claim is
    unclaimed_merkle_funds = ??
}

invariant solvency()
    token.balanceOf(currentContract) >= unclaimed_merkle_funds
*/

// if ENS balance of current contract goes down by Δ,
//   - * it only happens in the claim(index,account,amount,proof) method
//   - * amt should be Δ
//   - * index should have been unclaimed before
//   - * index should be claimed after
//   - * account's balance should increase by Δ
//   - ? proof is in the merkle tree



rule once_claimed_always_claimed {
    uint256 index;

    require isClaimed(index);

    method f; env e; calldataarg args;
    f(e, args);

    assert isClaimed(index);
}

// MDG: I haven't tried running this rule yet
rule only_claim_transfers {
    address addr;

    uint256 balance = token.balanceOf(addr);

    method f; env e; calldataarg args;
    f(e, args);

    assert balance != token.balanceOf(addr)
        => f.selector == claim(uint256,address,uint256,bytes32[]).selector;
}




