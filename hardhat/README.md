# Web3 dao tool

## Deploy locally

```bash
npx hardhat node
npx hardhat run --network localhost scripts/deployT3Token.ts
npx hardhat run --network localhost scripts/deployT3TimeCoin.ts
```

## Tasks

### Airdrop

```bash
npx hardhat --network localhost airdrop --token T3Token --address TOKEN_ADDR --account ACCOUNT_A,ACCOUNT_B --amount 1,2
```
