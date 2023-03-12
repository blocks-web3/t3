import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", function () {
  async function deployToken() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("T3Token");
    const token = await Token.deploy(0);
    await token.airdrop([owner.address], [10]);

    return { token, owner, user1, user2 };
  }

  describe("Deploy", function () {
    it("Owner have all balances", async function () {
      const { token, owner } = await loadFixture(deployToken);
      const ownerBalance = await token.balanceOf(owner.address);

      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Users can transfer", async function () {
      const { token, user1, user2 } = await loadFixture(deployToken);
      const tx1 = await token.transfer(user1.address, 10);
      const user1Balance = await token.balanceOf(user1.address);

      expect(user1Balance).to.equal(10);

      const tx2 = await token.connect(user1).transfer(user2.address, 10);
      const user2Balance = await token.balanceOf(user2.address);
      expect(user1Balance).to.equal(user2Balance);
    });
  });
});
