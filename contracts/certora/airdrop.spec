using TestERC20 as token

methods {
    // declaring methods envfree means we don't need to pass an environment arg
    isClaimed(uint256) returns bool envfree;
    token.balanceOf(address) returns uint256 envfree;
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

