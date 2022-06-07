certoraRun \
    certora/StatusENSAirdropHarness.sol \
    contracts/TestERC20.sol \
    --verify StatusENSAirdropHarness:certora/airdrop.spec \
    --link StatusENSAirdropHarness:token=TestERC20 \
    --solc solc8.10 \
    --loop_iter 3 --optimistic_loop \
    --settings -useBitVectorTheory \
    --rule successful_claim_requires_verification \
    --send_only \
    --staging \
    --msg "no message"

