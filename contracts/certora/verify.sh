certoraRun \
    contracts/StatusENSAirdrop.sol \
    contracts/TestERC20.sol \
    --verify StatusENSAirdrop:certora/airdrop.spec \
    --solc solc8.10 \
    --loop_iter 3 --optimistic_loop \
    --link StatusENSAirdrop:token=TestERC20

