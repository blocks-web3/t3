import { ethers } from "hardhat";
import { deployGovernor } from "../test/common";

async function main() {
  const [owner] = await ethers.getSigners();
  const t3TokenAddress = "0xUPDATE_ME";
  const { timelock, governor } = await deployGovernor(
    owner.address,
    t3TokenAddress,
    1,
    0,
    10,
    1
  );

  const Factory = await ethers.getContractFactory("ProjectFactory");
  const factory = await Factory.deploy(timelock.address);

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
