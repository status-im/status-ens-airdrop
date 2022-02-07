const { expect } = require("chai");
const { ethers } = require("hardhat");
const MerkleTree = require('../lib/merkleTree')
// const { MerkleTree } = require('merkletreejs')
const { BN } = require('../lib/utils')
const keccak256 = require('keccak256');


const data = [
  { index: 0, address: "0x0000000000000000000000000000000000000001", amount: "10000000000000000000" }, // 10
  { index: 1, address: "0x0000000000000000000000000000000000000002", amount: "20000000000000000000" },
  { index: 2, address: "0x0000000000000000000000000000000000000003", amount: "30000000000000000000" },
  { index: 3, address: "0x0000000000000000000000000000000000000004", amount: "40000000000000000000" },
  { index: 4, address: "0x0000000000000000000000000000000000000005", amount: "50000000000000000000" },
];

describe("StatusENSAirdrop", function () {
  before(async function() {
    this.tree = new MerkleTree(data);
  });

  it("test", async function () {
    const [owner] = await ethers.getSigners();

    const TestERC20 = await hre.ethers.getContractFactory("TestERC20");
    const testERC20 = await TestERC20.deploy();
    await testERC20.deployed();

    const StatusENSAirdrop = await hre.ethers.getContractFactory("StatusENSAirdrop");
    const contract = await StatusENSAirdrop.deploy(this.tree.getRoot(), testERC20.address);

    await testERC20.transfer(contract.address, await testERC20.balanceOf(owner.address));

    expect((await testERC20.balanceOf(owner.address)).toString()).to.equal("0");
    expect((await testERC20.balanceOf(contract.address)).toString()).to.equal("1000000000000000000000"); // 1000

    const claim = data[0];
    const leaf = this.tree.hashItem(claim);
    const proof = this.tree.getProof(leaf);

    await contract.claim(claim.index, claim.address, "10000000000000000000", proof);
  });
});
