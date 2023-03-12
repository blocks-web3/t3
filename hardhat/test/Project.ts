import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Project", function () {
  async function deployProject() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("T3TimeCoin");
    const token = await Token.deploy(0);
    await token.airdrop([owner.address], [10]);

    const Factory = await ethers.getContractFactory("ProjectFactory");
    const factory = await Factory.deploy();

    return { token, factory, owner, user1, user2 };
  }

  describe("Test Project with TimeCoin", function () {
    it("Create project and support", async function () {
      const { token, factory, owner, user1 } = await loadFixture(deployProject);
      await token.transfer(user1.address, 1);

      const projectID = "DAO Tool Project";
      const period = 3; // expires 2 blocks later

      const tx = await factory.createProject(token.address, projectID, period);
      const receipt = await tx.wait();

      const projectEvent = receipt.events[2];
      expect(projectEvent.args[0]).to.equal(owner.address);

      const projectIDHash = ethers.utils.id(projectID);
      expect(projectEvent.args[1].hash).to.equal(projectIDHash);

      const projectAddress = projectEvent.args[2];
      expect(await factory.getProjectAddress(projectID)).to.equal(projectAddress);

      const project = await ethers.getContractAt("Project", projectAddress, owner);

      await token.connect(user1).approve(projectAddress, 1); // approve before donation

      await project.connect(user1).support(1); // Donate/Vote T3 token

      await project.withdraw();
      expect(await project.donors(user1.address)).to.equal(1);
      expect(await project.donors(owner.address)).to.equal(0);
      expect(await token.balanceOf(owner.address)).to.equal(10);
    });
  });
});
