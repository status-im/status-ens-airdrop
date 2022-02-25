import config from "../config";
import claimData from "../data.json";
import { global } from '../global';
import { Claim } from "../types";
import {
  Dispatch,
} from 'redux';
import { RootState } from "../reducers";
import contractABI from "../abis/StatusENSAirdrop";

export const CONTRACT_INITIALIZED = "CONTRACT_INITIALIZED";
export interface ContractInitializedAction {
  type: typeof CONTRACT_INITIALIZED
  address: string
  claimed: boolean
  error: string | undefined
}

export const CONTRACT_TX_SENT = "CONTRACT_TX_SENT";
export interface ContractTxSentAction {
  type: typeof CONTRACT_TX_SENT
  txHash: string
}

export type ContractActions =
  ContractInitializedAction;

const initialized = (address: string): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  claimed: false,
  error: undefined,
});

const wrongMerkleRoot = (address: string, expected: string, got: string): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  claimed: false,
  error: `wrong merkle root. expected: ${expected}, got: ${got}`,
});

const alreadyClaimed = (address: string): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  claimed: true,
  error: "already claimed",
});

const contractInteractionError = (address: string): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  address,
  claimed: false,
  error: "error interacting with the contract",
});

export const initializeContract = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const address = config.contract;
    const contract = new global.web3!.eth.Contract(contractABI, address);
    try {
      const root = await contract.methods.merkleRoot().call();
      if (root !== claimData.merkleRoot) {
        dispatch(wrongMerkleRoot(address, claimData.merkleRoot, root));
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError(address));
      return;
    }

    try {
      const claimed = await contract.methods.isClaimed(claim.index).call();
      if (claimed) {
        dispatch(alreadyClaimed(address));
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError(address));
      return;
    }

    dispatch(initialized(address));
  }
}

export const claim = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const contract = new global.web3!.eth.Contract(contractABI, config.contract);
    alert(state.web3.chainID)
    const res = await contract.methods.claim(claim.index, claim.address, claim.amount, claim.proof).send({
      from: state.web3.account,
      chainId: state.web3.chainID,
    });
    console.log("res", res)
  }
}
