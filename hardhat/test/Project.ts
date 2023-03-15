import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployGovernor, increaseBlock, ProposalState, proposeOne } from "./common";

describe("Project", function () {
  async function deployProject() {
    const [owner, user1, user2] = await ethers.getSigners();

    const GovToken = await ethers.getContractFactory("T3Token");
    const govToken = await GovToken.deploy(10);
    const { governor, timelock } = await deployGovernor(
      owner.address,
      govToken.address,
      1,
      1,
      2,
      1
    );

    const Token = await ethers.getContractFactory("T3TimeCoin");
    const token = await Token.deploy(0);
    await token.airdrop([owner.address], [10]);

    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy(token.address, timelock.address);

    return { token, factory, governor, owner, user1, user2 };
  }

  describe("Test Project with TimeCoin", function () {
    const projectID = "DAO Tool Project";
    const projectDescription = "This is a project for DAO Tool";
    const targetAmount = 1;
    const period = 4; // expires period - 1 blocks later

    it("Create project", async function () {
      const { factory, owner, user1 } = await loadFixture(deployProject);

      const tx = await factory.createProject(
        projectID,
        projectDescription,
        targetAmount,
        period
      );
      const receipt = await tx.wait();

      const projectEvent = receipt.events[2];
      expect(projectEvent.args[0]).to.equal(owner.address);

      const projectIDHash = ethers.utils.id(projectID);
      expect(projectEvent.args[1].hash).to.equal(projectIDHash);

      const projectAddress = projectEvent.args[2];
      expect(await factory.projects(projectID)).to.equal(projectAddress);

      const project = await ethers.getContractAt("Project", projectAddress, owner);
      await expect(project.connect(user1).makeComplete()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Support project", async function () {
      const { token, factory, owner, user1 } = await loadFixture(deployProject);
      await token.transfer(user1.address, 1);

      const tx = await factory.createProject(
        projectID,
        projectDescription,
        targetAmount,
        period
      );

      const projectAddress = await factory.projects(projectID);
      const project = await ethers.getContractAt("Project", projectAddress, owner);

      await token.connect(user1).approve(projectAddress, 1); // approve before donation

      await expect(project.withdraw()).to.be.revertedWith(
        "Project: You cannot withdraw before expiration"
      );

      await project.connect(user1).support(1); // Donate/Vote T3 token

      await expect(project.support(1)).to.be.revertedWith(
        "Project: You cannot support after expiration"
      );

      await expect(project.withdraw()).to.changeTokenBalances(
        token,
        [project, owner],
        [-1, 1]
      );

      expect(await project.donors(user1.address)).to.equal(1);
      expect(await project.donors(owner.address)).to.equal(0);
      expect(await token.balanceOf(owner.address)).to.equal(10);
    });

    it("Evaluate project", async function () {
      const { token, factory, owner, user1, governor } = await loadFixture(
        deployProject
      );
      await token.transfer(user1.address, 1);

      await factory.createProject(projectID, projectDescription, targetAmount, period);
      const projectAddress = await factory.projects(projectID);
      const project = await ethers.getContractAt("Project", projectAddress, owner);

      const calldata = project.interface.encodeFunctionData("makeSucceeded()");
      const descriptionHash = ethers.utils.id(
        "Propose evaluating Project: " + projectID
      );
      const proposalId = await governor.hashProposal(
        [project.address],
        [0],
        [calldata],
        descriptionHash
      );

      const tx = await governor.proposeProjectEvaluation(project.address, projectID);
      const receipt = await tx.wait();

      // ID calculated in solidity should be equal to here
      expect(proposalId).to.equal(receipt.events[0].args.proposalId);

      await increaseBlock();

      await governor.castVote(proposalId, 1);
      await increaseBlock();

      const proposalStatus = await governor.proposals(proposalId);
      expect(proposalStatus.forVotes).to.equal(10);

      expect(ProposalState[await governor.state(proposalId)]).equal("Active");
      await increaseBlock();
      expect(ProposalState[await governor.state(proposalId)]).equal("Succeeded");

      await governor["queue(uint256)"](proposalId);
      expect(await project.isSucceeded()).to.equal(false);

      await expect(governor["execute(uint256)"](proposalId)).to.be.revertedWith(
        "TimelockController: underlying transaction reverted"
      );

      // make complete before
      await project.makeComplete();

      await governor["execute(uint256)"](proposalId);
      expect(await project.isSucceeded()).to.equal(true);
    });

    it("Create project via Proposal", async function () {
      const { factory, owner, governor } = await loadFixture(deployProject);

      const calldata = factory.interface.encodeFunctionData(
        "createProject(string,string,uint256,uint256)",
        [projectID, projectDescription, targetAmount, period]
      );

      const descriptionHash = ethers.utils.id("Propose creating Project: " + projectID);
      const proposalId = await governor.hashProposal(
        [factory.address],
        [0],
        [calldata],
        descriptionHash
      );

      const tx = await governor.proposeProjectCreation(
        factory.address,
        projectID,
        projectDescription,
        targetAmount,
        period
      );
      const receipt = await tx.wait();

      // ID calculated in solidity should be equal to here
      expect(proposalId).to.equal(receipt.events[0].args.proposalId);

      await increaseBlock();
      await governor.castVote(receipt.events[0].args.proposalId, 1);
      await increaseBlock();

      await governor["queue(uint256)"](proposalId);
      await governor["execute(uint256)"](proposalId);

      const projectAddress = await factory.projects(projectID);
      const project = await ethers.getContractAt("Project", projectAddress, owner);

      // even if created by proposal, the owner is the same
      await project.makeComplete();
      expect(await project.isComplete()).to.equal(true);
    });
  });
});
