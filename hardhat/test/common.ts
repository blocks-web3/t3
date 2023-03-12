import { ethers } from "hardhat";

export async function deployGovernor(
  adminAddress: string,
  tokenAddress: string,
  timelockMinDelay: number,
  votingDelay: number,
  votingPeriod: number,
  proposalThreshold: number
) {
  const Timelock = await ethers.getContractFactory("TimelockController");

  const timelock = await Timelock.deploy(
    timelockMinDelay, // min delay (blocks) between queue and execute
    [], // proposers, this should be governor contract
    [], // executors, this should be governor contract
    adminAddress
  );

  const PROPOSER_ROLE = ethers.utils.id("PROPOSER_ROLE");
  const EXECUTOR_ROLE = ethers.utils.id("EXECUTOR_ROLE");

  const Governor = await ethers.getContractFactory("T3Governor");
  const governor = await Governor.deploy(
    tokenAddress,
    timelock.address,
    votingDelay,
    votingPeriod,
    proposalThreshold
  );

  await timelock.grantRole(PROPOSER_ROLE, governor.address);
  await timelock.grantRole(EXECUTOR_ROLE, governor.address);
  return { timelock, governor };
}

export async function increaseBlock() {
  await ethers.provider.send("evm_mine", []);
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}
