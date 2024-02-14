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

      const depositAmount = ethers.parseEther("1.0");

      await savings.deposit({ value: depositAmount });

      const userBal = await savings.checkUserBal();

      expect(userBal).to.be.equal(depositAmount);
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

  describe("Withdrawal Check", function () {
    it("Should revert if the withdrawal address is 0", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      await savings.deposit({ value: ethers.parseEther("1.0") });

      const withdrawer = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(withdrawer).is.not.equal(nullAddress);
    });

    it("Should revert if the user's savings is 0", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      await expect(savings.withdraw()).to.be.revertedWith("No savings stored");
    });

    it("Should check if the withdrawal is successful", async function () {
      const { savings } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("1.0");

      await savings.deposit({ value: depositAmount });

      const initialBal = await savings.checkUserBal();

      expect(initialBal).to.be.equal(depositAmount);

      await savings.withdraw();

      const balCheck = await savings.checkUserBal();

      expect(balCheck).to.be.equal("0");
    });
  });

  describe("Events Check", function () {
    it("Should check if the deposit event is working", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      const depositAmount = "1.0";

      const tx = await savings.deposit({
        value: ethers.parseEther(depositAmount),
      });

      await expect(tx)
        .to.emit(savings, "SavingsSuccssful")
        .withArgs(owner, anyValue);
    });
  });

  describe("Contract Balance", function () {
    it("Should check if the deposit event is working", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      const contractBal = await savings.checkContractBal();

      expect(contractBal).to.be.equal(depositAmount);
    });
  });

  describe("User Savings Check", function () {
    it("Should return user's balance if user has savings", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      const userBal = await savings.checkSavings(owner.address);

      expect(userBal).to.be.equal(depositAmount);
    });

    it("Should return 0 balance if user has do not have savings", async function () {
      const { savings, otherAccount } = await loadFixture(
        deploySavingsContract
      );

      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      const anotherUserAddress = await savings.checkSavings(
        otherAccount.address
      );

      expect(anotherUserAddress).to.be.equal("0");
    });
  });
});
