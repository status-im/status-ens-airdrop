# Status ENS Airdrop / Contracts

## Setup

`git@github.com:status-im/status-ens-airdrop.git`

`cd status-ens-airdrop/contracts`

`yarn`

## Compile Smart Contracts

`npx hardhat compile`

## Deploy the StatusENSAirdrop

`npx hardhat run scripts/deploy/deploy.js`

It will shoe the following output:

```
chainId: 31337
network: [NETWORK_NAME]
account: 0xa16b803f09b0693823fd264807adc6d4579827ce
account balance: 10000000000000000000000 ( 10000.0 )
MERKLE_ROOT: 0x...
do you want to deploy the StatusENSAirdrop contract? [y/n]: y
```

Write `y` or `yes` to confirm.

```
StatusENSAirdrop deployed to: 0xa16b803f09b0693823fd264807adc6d4579827ce
```

## Test

`TODO`


## TODO

- [x] Airdrop Contract
- [ ] Airdrop Contract unit tests
- [x] Deploy script
- [ ] Script to send ENS tokens to the contract
- [ ] Integration test script with ethereum fork
- [ ] Client app
