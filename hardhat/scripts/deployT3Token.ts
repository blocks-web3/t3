import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("T3Token");
  const factory = await Factory.deploy(100000000000000);

  const response = await factory.deployed();

  console.log(`deployed T3Token. response: `, response);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
