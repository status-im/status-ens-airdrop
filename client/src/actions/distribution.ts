import claimData from "../data.json";
import { global } from '../global';
import { Claim, ClaimMap} from "../types";

export const DISTRIBUTION_INITIALIZING = "DISTRIBUTION_INITIALIZING";
export interface DistributionInitializingAction {
  type: typeof DISTRIBUTION_INITIALIZING
}

export const DISTRIBUTION_INITIALIZED = "DISTRIBUTION_INITIALIZED";
export interface DistributionInitializedAction {
  type: typeof DISTRIBUTION_INITIALIZED
  claim: Claim | undefined
}

export type DistributionActions =
  DistributionInitializingAction |
  DistributionInitializedAction;

const distributionInitialized = (claim: Claim | undefined): DistributionActions => ({
  type: DISTRIBUTION_INITIALIZED,
  claim,
})

export const initializeDistribution = (account: string) => {
  const claims: ClaimMap = claimData.claims;
  const claim = claims[account];
  return distributionInitialized(claim);
}
