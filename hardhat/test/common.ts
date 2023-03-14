import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { T3Governor } from "../typechain-types";

export async function deployGovernor(
  adminAddress: string,
  tokenAddress: string,
  timelockMinDelay: number,
  votingDelay: number,
  votingPeriod: number,
  proposalThreshold: BigNumberish
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

export async function proposeOne(
  governor: T3Governor,
  proposer: SignerWithAddress,
  target: string,
  calldata: string,
  description: string
) {
  const descriptionHash = ethers.utils.id(description);

  await governor
    .connect(proposer)
  ["propose(address[],uint256[],bytes[],string)"](
    [target],
    [0],
    [calldata],
    description
  );

  const proposalId = await governor.hashProposal(
    [target],
    [0],
    [calldata],
    descriptionHash
  );
  return { proposalId };
}
export const ONE_ETHER = ethers.utils.parseEther("1");

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
