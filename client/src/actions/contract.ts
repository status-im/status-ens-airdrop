import config from "../config";
import claimData from "../data.json";
import { global } from '../global';
import { Claim } from "../types";
import {
  Dispatch,
} from 'redux';
import { RootState } from "../reducers";
import contractABI from "../abis/StatusENSAirdrop";
import erc20ABI from "../abis/ERC20";

export const CONTRACT_INITIALIZED = "CONTRACT_INITIALIZED";
export interface ContractInitializedAction {
  type: typeof CONTRACT_INITIALIZED
  address: string
  tokenSymbol: string | undefined
  tokenDecimals: string | undefined
  claimed: boolean
  error: string | undefined
}

export const CONTRACT_CLAIMING = "CONTRACT_CLAIMING";
export interface ContractClaimingAction {
  type: typeof CONTRACT_CLAIMING
  txHash: string
}

export const CONTRACT_CLAIMED = "CONTRACT_CLAIMED";
export interface ContractClaimedAction {
  type: typeof CONTRACT_CLAIMED
  error: string | undefined
}

export type ContractActions =
  ContractInitializedAction |
  ContractClaimingAction |
  ContractClaimedAction;

const initialized = (address: string, tokenSymbol: string | undefined, tokenDecimals: string | undefined): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  tokenSymbol,
  tokenDecimals,
  claimed: false,
  error: undefined,
});

const claiming = (txHash: string): ContractActions => ({
  type: CONTRACT_CLAIMING,
  txHash,
});

const claimed = (error: string | undefined): ContractActions => ({
  type: CONTRACT_CLAIMED,
  error,
});

const wrongMerkleRoot = (address: string, tokenSymbol: string | undefined, tokenDecimals: string | undefined, expected: string, got: string): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  tokenSymbol,
  tokenDecimals,
  claimed: false,
  error: `wrong merkle root. expected: ${expected}, got: ${got}`,
});

const alreadyClaimed = (address: string, tokenSymbol: string | undefined, tokenDecimals: string | undefined): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  tokenSymbol,
  tokenDecimals,
  claimed: true,
  error: "already claimed",
});

const contractInteractionError = (address: string, tokenSymbol: string | undefined, tokenDecimals: string | undefined): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  tokenSymbol,
  tokenDecimals,
  claimed: false,
  error: "error interacting with the contract",
});

export const initializeContract = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const address = config.contract;
    const contract = new global.web3!.eth.Contract(contractABI, address);
    let tokenSymbol, tokenDecimals;
    try {
      const root = await contract.methods.merkleRoot().call();
      if (root !== claimData.merkleRoot) {
        dispatch(wrongMerkleRoot(address, tokenSymbol, tokenDecimals, claimData.merkleRoot, root));
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError(address, tokenSymbol, tokenDecimals));
      return;
    }

    try {
      const tokenAddress = await contract.methods.token().call();
      const token = new global.web3!.eth.Contract(erc20ABI, tokenAddress);
      tokenSymbol = await token.methods.symbol().call();
      tokenDecimals = await token.methods.decimals().call();
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError(address, tokenSymbol, tokenDecimals));
      return;
    }

    try {
      const claimed = await contract.methods.isClaimed(claim.index).call();
      if (claimed) {
        dispatch(alreadyClaimed(address, tokenSymbol, tokenDecimals));
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError(address, tokenSymbol, tokenDecimals));
      return;
    }

    dispatch(initialized(address, tokenSymbol, tokenDecimals));
  }
}

export const claim = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const contract = new global.web3!.eth.Contract(contractABI, config.contract);
    contract.methods.claim(claim.index, claim.address, claim.amount, claim.proof).send({
      from: state.web3.account,
      chainId: state.web3.chainID,
    }).on('transactionHash', (hash: string) => {
      dispatch(claiming(hash));
    }).on('error', (error: any) => {
      dispatch(claiming(error.toString()));
    }).then(() => {
      dispatch(claimed(undefined));
    }).catch((error: any) => {
      dispatch(claimed(error.toString()));
    });
  }
}
