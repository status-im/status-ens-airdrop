import { combineReducers } from 'redux';
import {
  Web3State,
  web3Reducer,
} from './web3';
import {
  DistributionState,
  distributionReducer,
} from './distribution';
import {
  ContractState,
  contractReducer,
} from './contract';

export interface RootState {
  web3: Web3State,
  distribution: DistributionState,
  contract: ContractState,
}

export const createRootReducer = () => combineReducers({
  web3: web3Reducer,
  distribution: distributionReducer,
  contract: contractReducer,
});
