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
    it("Should deposit ETH correctly", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      const depositAmount = "1.0";

      const tx = await savings.deposit({
        value: ethers.parseEther(depositAmount),
      });

      await expect(tx)
        .to.emit(savings, "SavingsSuccssful")
        .withArgs(owner, anyValue);
    });

    it("Should revert if the sender address is 0", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      await savings.deposit({ value: ethers.parseEther("1.0") });

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });

    it("Should revert if the deposit amount is 0", async function () {
      // Deploy the contract
      const { savings } = await loadFixture(deploySavingsContract);

      // Attempt deposit with 0 ETH
      await expect(savings.deposit({ value: 0 })).to.be.revertedWith(
        "insufficient amount"
      );
    });
  });
});
