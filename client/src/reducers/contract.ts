import {
  CONTRACT_INITIALIZED,
  ContractActions
} from "../actions/contract";
import { Claim } from "../types";

export interface ContractState {
  address: string | undefined
  initialized: boolean
  claimed: boolean
  error: string  | undefined
}

const initialState: ContractState = {
  address: undefined,
  initialized: false,
  claimed: false,
  error: undefined
}

export const contractReducer = (state: ContractState = initialState, action: ContractActions): ContractState => {
  switch (action.type) {
    case CONTRACT_INITIALIZED: {
      return {
        ...state,
        address: action.address,
        initialized: true,
        claimed: action.claimed,
        error: action.error,
      }
    }
  }

  return state;
}
