import {
  CONTRACT_INITIALIZED,
  CONTRACT_CLAIMING,
  CONTRACT_CLAIMED,
  ContractActions
} from "../actions/contract";
import { Claim } from "../types";

export interface ContractState {
  address: string | undefined
  tokenSymbol: string | undefined
  tokenDecimals: string | undefined
  initialized: boolean
  claimed: boolean
  error: string  | undefined
  claiming: boolean,
  txHash: string | undefined,
  claimedNow: boolean,
  claimError: string | undefined,
}

const initialState: ContractState = {
  address: undefined,
  tokenSymbol: undefined,
  tokenDecimals: undefined,
  initialized: false,
  claimed: false,
  error: undefined,
  claiming: false,
  txHash: undefined,
  claimedNow: false,
  claimError: undefined
}

export const contractReducer = (state: ContractState = initialState, action: ContractActions): ContractState => {
  switch (action.type) {
    case CONTRACT_INITIALIZED: {
      return {
        ...state,
        address: action.address,
        tokenSymbol: action.tokenSymbol,
        tokenDecimals: action.tokenDecimals,
        initialized: true,
        claimed: action.claimed,
        error: action.error,
      }
    }

    case CONTRACT_CLAIMING: {
      return {
        ...state,
        claiming: true,
        txHash: action.txHash,
      }
    }

    case CONTRACT_CLAIMED: {
      return {
        ...state,
        claiming: false,
        claimError: action.error,
        claimedNow: action.error === undefined ? true : false,
      }
    }
  }

  return state;
}
