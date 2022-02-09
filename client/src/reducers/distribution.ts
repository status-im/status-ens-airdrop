import {
  DISTRIBUTION_INITIALIZED,
  DistributionActions
} from "../actions/distribution";
import { Claim } from "../types";

export interface DistributionState {
  initialized: boolean
  found: boolean | undefined
  error: string | undefined
  claim: Claim | undefined
}

const initialState: DistributionState = {
  initialized: false,
  found: undefined,
  error: undefined,
  claim: undefined
}

export const distributionReducer = (state: DistributionState = initialState, action: DistributionActions): DistributionState => {
  switch (action.type) {
    case DISTRIBUTION_INITIALIZED: {
      return {
        ...state,
        initialized: true,
        found: action.claim !== undefined,
        claim: action.claim
      }
    }
  }

  return state;
}
