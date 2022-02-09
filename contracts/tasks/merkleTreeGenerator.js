const MT = require('merkletreejs')
const MerkleTree = require('../lib/merkleTree')
const fs = require('fs');
const util = require('util')

task("generate-merkle-tree", "Generates Merkle Tree")
  .addParam("file", "Data file path")
  .setAction(async ({ file }) => {
    const content = fs.readFileSync(file);
    const data = JSON.parse(content);
    const tree = new MerkleTree(data);

    const out = {
      root: undefined,
      claims: {},
    };

    out.root = tree.getRoot();
    data.forEach(item => {
      const leaf = tree.hashItem(item);
      const proof = tree.getProof(leaf);
      out.claims[item.address] = {
        ...item,
        proof,
      };
    });

    // console.log(tree.verify(proof, leaf))
    console.log(util.inspect(out, { showHidden: false, depth: null }));
  });
