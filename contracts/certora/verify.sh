certoraRun \
    contracts/StatusENSAirdrop.sol \
    contracts/TestERC20.sol \
    --verify StatusENSAirdrop:certora/airdrop.spec \
    --solc solc8.10 \
    --loop_iter 3 --optimistic_loop \
    --settings -useBitVectorTheory \
    --link StatusENSAirdrop:token=TestERC20

