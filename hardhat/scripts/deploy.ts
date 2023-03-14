import { ethers } from "hardhat";
import { deployGovernor, ONE_ETHER } from "../test/common";

const INITIAL_SUPPLY = ONE_ETHER.mul(10);

async function main() {
  const [owner] = await ethers.getSigners();

  const T3Token = await ethers.getContractFactory("T3TimeCoin");
  const coin = await T3Token.deploy(INITIAL_SUPPLY);
  console.log(`T3 time coin address: ${coin.address}`);

  const Token = await ethers.getContractFactory("T3Token");
  const token = await Token.deploy(INITIAL_SUPPLY);
  console.log(`T3 token address: ${token.address}`);

  const t3TimeCoinAddress = coin.address;
  const t3TokenAddress = token.address;

  // For block time 15s on ethereum, 1 day == 6575 blocks, 1 week == 46027 blocks
  const { timelock, governor } = await deployGovernor(
    owner.address,
    t3TokenAddress,
    1,
    0,
    100,
    ONE_ETHER // threshold: at least one ether to propose
  );

  const Factory = await ethers.getContractFactory("ProjectFactory");
  const factory = await Factory.deploy(t3TimeCoinAddress, timelock.address);

  console.log(`Timelock address ${timelock.address}`);
  console.log(`Governor address ${governor.address}`);
  console.log(`Factory address ${factory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
