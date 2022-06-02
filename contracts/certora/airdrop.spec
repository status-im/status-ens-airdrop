using TestERC20 as token

methods {
    // declaring methods envfree means we don't need to pass an environment arg
    isClaimed(uint256) returns bool envfree;
    token.balanceOf(address) returns uint256 envfree;
}

// if ENS balance of current contract goes down by Δ,
//   - * it only happens in the claim(index,account,amount,proof) method
//   - * amt should be Δ
//   - * index should have been unclaimed before
//   - * index should be claimed after
//   - * account's balance should increase by Δ
//   - ? proof is in the merkle tree


// TODO: this rule may be passing vacuously (it fails rule_sanity)
rule successful_claim_requires_verification {
    env e;
    uint256 index; address account; uint256 amount; bytes32[] proof;

    claim(e, index, account, amount, proof);

    assert _verify(e, index, account, amount, proof),
        "if claim is successful, encoded request must be verified";
}

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




