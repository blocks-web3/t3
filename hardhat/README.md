# Web3 dao tool

## Deploy

- Local

```bash
$ npx hardhat node
$ npx hardhat run --network localhost scripts/deploy.ts
T3 time coin address: [ADDRESS_1]
T3 token address: [ADDRESS_2]
Timelock address [ADDRESS_3]
Governor address [ADDRESS_4]
Factory address [ADDRESS_5]
```

- testnet

```bash
$ npx hardhat run --network mumbai scripts/deploy.ts
...
```

## Tasks

### Airdrop

```bash
npx hardhat --network localhost airdrop --token T3Token --address TOKEN_ADDR --account ACCOUNT_A,ACCOUNT_B --amount 1,2
```
