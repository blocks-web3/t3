import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ONE_ETHER } from "./common";

const INITIAL_SUPPLY = ONE_ETHER.mul(10);

for (const name of ["T3Token", "T3TimeCoin"]) {
  describe(`${name}`, function () {
    async function deployToken() {
      const [owner, user1, user2] = await ethers.getSigners();

      const Token = await ethers.getContractFactory(name);

      const token = await Token.deploy(INITIAL_SUPPLY);
      expect(await token.totalSupply()).to.equal(ONE_ETHER.mul(10));

      await token.burn(INITIAL_SUPPLY);
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
        const { token, owner, user1, user2 } = await loadFixture(deployToken);

        await expect(token.transfer(user1.address, 10)).to.changeTokenBalances(
          token,
          [owner, user1],
          [-10, 10]
        );

        await expect(
          token.connect(user1).transfer(user2.address, 10)
        ).to.changeTokenBalances(token, [user1, user2], [-10, 10]);
      });
    });
  });
}
