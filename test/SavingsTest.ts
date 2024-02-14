import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Testing the Savings Contract", function () {
  async function deploySavingsContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SaveEther = await ethers.getContractFactory("Savings");
    const savings = await SaveEther.deploy();

    return { savings, owner, otherAccount };
  }

  describe("Deployment Check", function () {
    it("Check if contract was deployed", async function () {
      const { savings } = await loadFixture(deploySavingsContract);

      expect(savings).to.exist;
    });
  });

  describe("Deposit Check", function () {
    it("should check if the deposit was successful", async function () {
      const { savings } = await loadFixture(deploySavingsContract);
    });
  });
});
