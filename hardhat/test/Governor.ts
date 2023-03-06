import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Governor", function () {
  async function deployGovernor() {
    const [system, proposer, contributor, collaborator] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("T3Token");
    const token = await Token.deploy(11);
    expect(await token.delegates(system.address)).to.equal(system.address);

    const Timelock = await ethers.getContractFactory("TimelockController");
    const delay = 2;

    const timelock = await Timelock.deploy(
      delay, // min delay (blocks) between queue and execute
      [], // proposers, this should be governor contract
      [], // executors, this should be governor contract
      system.address
    );

    const PROPOSER_ROLE = ethers.utils.id("PROPOSER_ROLE");
    const EXECUTOR_ROLE = ethers.utils.id("EXECUTOR_ROLE");

    const Governor = await ethers.getContractFactory("T3Governor");
    const governor = await Governor.deploy(token.address, timelock.address, 2, 3, 1);
    expect(await token.delegates(system.address)).to.equal(system.address);

    // console.log(system.address, governor.address, token.address, timelock.address);

    await timelock.grantRole(PROPOSER_ROLE, governor.address);
    await timelock.grantRole(EXECUTOR_ROLE, governor.address);

    return { token, timelock, governor, system, proposer, contributor, collaborator };
  }

  async function increaseBlock() {
    await ethers.provider.send("evm_mine", []);
  }

  describe("Deploy", function () {
    it("Propose a transfer proposal", async function () {
      const { governor, timelock, token, proposer, contributor, collaborator } =
        await loadFixture(deployGovernor);

      const transferCalldata = token.interface.encodeFunctionData("transfer", [
        collaborator.address,
        10,
      ]);

      await token.transfer(proposer.address, 1);

      // delegate myself to gain vote power
      for (const account of [proposer, contributor]) {
        await token.connect(account).delegate(account.address);
        expect(await token.delegates(account.address)).to.equal(account.address);
      }

      // propose: only those who have token >= threshold can propose
      const description = "Proposal #1: Give T3 token to collaborator";
      await governor
        .connect(proposer)
      ["propose(address[],uint256[],bytes[],string)"](
        [token.address],
        [0],
        [transferCalldata],
        description
      );

      const descriptionHash = ethers.utils.id(description);
      const proposalId = await governor.hashProposal(
        [token.address],
        [0],
        [transferCalldata],
        descriptionHash
      );

      // transfer token with vote power
      await token.transfer(contributor.address, 5);

      // wait for vote to be active
      await increaseBlock();

      // vote: any one can vote, but the vote power depends on your token
      await governor.castVote(proposalId, 1); // vote power: 10 - 5 == 5
      await governor.connect(contributor).castVote(proposalId, 1); // vote power: 0 + 5 == 5

      const proposalStatus = await governor.proposals(proposalId);
      expect(proposalStatus.forVotes).to.equal(10);

      // end the proposal to make it ready to queue
      await token.transfer(timelock.address, 5);

      // queue
      await governor["queue(uint256)"](proposalId);

      // make it ready to execute
      await token.connect(contributor).transfer(timelock.address, 5);

      // before execute
      expect(await token.balanceOf(timelock.address)).to.equal(10);
      expect(await token.balanceOf(collaborator.address)).to.equal(0);

      // execute
      await governor["execute(uint256)"](proposalId);
      expect(await token.balanceOf(timelock.address)).to.equal(0);
      expect(await token.balanceOf(collaborator.address)).to.equal(10);
    });
  });
});
