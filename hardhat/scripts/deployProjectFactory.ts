import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("ProjectFactory");
  const factory = await Factory.deploy();

  const response = await factory.deployed();

  console.log(`deployed Project factory. response: `, response);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
