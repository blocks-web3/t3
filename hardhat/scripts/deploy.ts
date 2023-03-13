import { ethers } from "hardhat";
import { deployGovernor } from "../test/common";

async function main() {
  const [owner] = await ethers.getSigners();
  const T3Token = await ethers.getContractFactory("T3TimeCoin");

  const coin = await T3Token.deploy(100000000000000);
  console.log(`T3 time coin address: ${coin.address}`);
  const t3TimeCoinAddress = coin.address;

  const Token = await ethers.getContractFactory("T3Token");
  const token = await Token.deploy(100000000000000);
  const t3TokenAddress = token.address;

  console.log(`T3 token address: ${token.address}`);

  const { timelock, governor } = await deployGovernor(
    owner.address,
    t3TokenAddress,
    1,
    0,
    10,
    1
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
