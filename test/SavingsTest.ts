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
      const { savings } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("1.0");

      await savings.deposit({ value: depositAmount });

      const userBal = await savings.checkUserBal();

      expect(userBal).to.be.equal(depositAmount);
    });

    it("Should check if the user's deposits increment", async function () {
      const { savings } = await loadFixture(deploySavingsContract);

      const depositAmount1 = ethers.parseEther("1.0");

      const depositAmount2 = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount1 });

      await savings.deposit({ value: depositAmount2 });

      const userBal = await savings.checkUserBal();

      const result = depositAmount1 + depositAmount2;

      expect(userBal).to.be.equal(result);
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
      const { savings } = await loadFixture(deploySavingsContract);

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
    it("Should check if the contract balance increments as users deposit", async function () {
      const { savings } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("2.0");
      const depositAmount1 = ethers.parseEther("2.0");
      const depositAmount2 = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });
      await savings.deposit({ value: depositAmount1 });
      await savings.deposit({ value: depositAmount2 });

      const contractBal = await savings.checkContractBal();

      const totalBal = depositAmount + depositAmount1 + depositAmount2;

      expect(contractBal).to.be.equal(totalBal);
    });
  });

  describe("Users Savings Check", function () {
    it("Should return any user's balance if that user has savings", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      const userBal = await savings.checkSavings(owner.address);

      expect(userBal).to.be.equal(depositAmount);
    });

    it("Should return 0 balance if user do not have savings", async function () {
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

  describe("User-to-User transfers", function () {
    it("Should revert if the sender's address is 0", async function () {
      const { savings, owner } = await loadFixture(deploySavingsContract);

      await savings.deposit({ value: ethers.parseEther("1.0") });

      const sender = owner.address;

      const nullAddress = "0x0000000000000000000000000000000000000000";

      expect(sender).is.not.equal(nullAddress);
    });

    it("Should revert if the sender's savings is 0", async function () {
      const { savings, otherAccount } = await loadFixture(
        deploySavingsContract
      );
      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      await expect(savings.sendoutSaving(otherAccount, 0)).to.be.revertedWith(
        "Can't send zero value"
      );
    });

    it("Should revert if the amount the sender is sending is greater than what is in the sender's savings", async function () {
      const { savings, otherAccount } = await loadFixture(
        deploySavingsContract
      );
      const depositAmount = ethers.parseEther("2.0");

      await savings.deposit({ value: depositAmount });

      const amountToSend = ethers.parseEther("4.0");

      await expect(
        savings.sendoutSaving(otherAccount, amountToSend)
      ).to.be.revertedWith("You don't have such amount");
    });

    it("Should check if sender really sent savings", async function () {
      const { savings, owner, otherAccount } = await loadFixture(
        deploySavingsContract
      );
      const depositAmount = ethers.parseEther("2.0");
      await savings.deposit({ value: depositAmount });

      const txSenderBal = await savings.checkSavings(owner.address);

      expect(txSenderBal).to.be.equal(depositAmount);

      const sendAmount = ethers.parseEther("1.0");

      await savings.sendoutSaving(otherAccount, sendAmount);

      const senderBal = await savings.checkSavings(owner.address);

      const expectedSenderBal = depositAmount - sendAmount;

      expect(senderBal).to.be.equal(expectedSenderBal);
    });
  });
  describe("User savings check", function () {
    it("Should return user's balance if user has savings", async function () {
      const { savings } = await loadFixture(deploySavingsContract);

      const depositAmount = ethers.parseEther("4.0");

      await savings.deposit({ value: depositAmount });

      const userBal = await savings.checkContractBal();

      expect(userBal).to.be.equal(depositAmount);
    });
  });
});
