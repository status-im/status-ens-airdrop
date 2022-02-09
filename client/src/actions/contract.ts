import config from "../config.json";
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

const initialized = (): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  claimed: false,
  error: undefined,
});

const wrongMerkleRoot = (): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  claimed: false,
  error: "wrong merkle root",
});

const alreadyClaimed = (): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  claimed: true,
  error: "already claimed",
});

const contractInteractionError = (): ContractActions => ({
  type: CONTRACT_INITIALIZED,
  claimed: false,
  error: "error interacting with the contract",
});

export const initializeContract = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const contract = new global.web3!.eth.Contract(contractABI, config.contract);
    try {
      const root = await contract.methods.merkleRoot().call();
      if (root !== config.merkleRoot) {
        dispatch(wrongMerkleRoot());
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError());
      return;
    }

    try {
      const claimed = await contract.methods.isClaimed(claim.index).call();
      if (claimed) {
        dispatch(alreadyClaimed());
        return;
      }
    } catch(error) {
      console.error(error);
      dispatch(contractInteractionError());
      return;
    }

    dispatch(initialized());
  }
}

export const claim = (claim: Claim) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const contract = new global.web3!.eth.Contract(contractABI, config.contract);
    const res = await contract.methods.claim(claim.index, claim.address, claim.amount, claim.proof).send({
      from: state.web3.account,
    });
    console.log("res", res)
  }
}
