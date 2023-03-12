import { ethers } from "hardhat";

async () => {
  const args = process.argv.slice(2);
  const [owner] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Lock");
  if (!["T3TimeCoin", "T3Token"].includes(args[0])) {
    throw new Error("Invalid token name");
  }

  const token = await ethers.getContractAt(args[0], args[1], owner);
  await token.airdrop([owner.address], [1]);
};
