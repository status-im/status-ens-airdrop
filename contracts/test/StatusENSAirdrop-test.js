const { expect } = require("chai");
const { ethers } = require("hardhat");
const MerkleTree = require('../lib/merkleTree')
// const { MerkleTree } = require('merkletreejs')
const { BN } = require('../lib/utils')
const keccak256 = require('keccak256');

function buildData(accounts) {
  const data = [];

  for (var i = 0; i < 10; i++) {
    data.push({
      index: i,
      address: accounts[i].address,
      amount: BN((100 + i) * (10 ** 18)).toString(), // 100, 101, 102, etc...
    });
  };

  return data;
}

describe("StatusENSAirdrop", function () {
  before(async function() {
    [this.owner, ...this.accounts] = await ethers.getSigners();
    this.data = buildData(this.accounts);
    this.tree = new MerkleTree(this.data);

    const TestERC20 = await hre.ethers.getContractFactory("TestERC20", this.owner);
    this.testERC20 = await TestERC20.deploy();
    await this.testERC20.deployed();

    const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");
    this.contract = await StatusENSAirdrop.deploy(this.tree.getRoot(), this.testERC20.address);

    await this.testERC20.transfer(this.contract.address, await this.testERC20.balanceOf(this.owner.address));
  });

  it("test", async function () {
    expect((await this.testERC20.balanceOf(this.owner.address)).toString()).to.equal("0");
    expect((await this.testERC20.balanceOf(this.contract.address)).toString()).to.equal("100000000000000000000000"); // 100_000

    for (var i = 0; i < 10; i++) {
      const claim = this.data[i];
      const leaf = this.tree.hashItem(claim);
      const proof = this.tree.getProof(leaf);

      expect(claim.amount).to.equal(BN((100 + i) * (10**18)).toString());

      expect((await this.testERC20.balanceOf(this.data[i].address)).toString()).to.equal("0");
      await this.contract.connect(this.accounts[i]).claim(claim.index, claim.address, claim.amount, proof);
      expect((await this.testERC20.balanceOf(this.data[i].address)).toString()).to.equal(claim.amount);
    };
  });
});
