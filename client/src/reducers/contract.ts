import {
  CONTRACT_INITIALIZED,
  ContractActions
} from "../actions/contract";
import { Claim } from "../types";

export interface ContractState {
  initialized: boolean
  claimed: boolean
  error: string  | undefined
}

const initialState: ContractState = {
  initialized: false,
  claimed: false,
  error: undefined
}

export const contractReducer = (state: ContractState = initialState, action: ContractActions): ContractState => {
  switch (action.type) {
    case CONTRACT_INITIALIZED: {
      return {
        ...state,
        initialized: true,
        claimed: action.claimed,
        error: action.error,
      }
    }
  }

  return state;
}
