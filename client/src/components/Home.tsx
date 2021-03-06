import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux';
import { RootState } from "../reducers";
import { initializeDistribution } from "../actions/distribution";
import Claim from "./Claim";

export default function() {
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    distributionInitialized: state.distribution.initialized,
    account: state.web3.account,
    claim: state.distribution.claim,
    contractAddress: state.contract.address,
  }), shallowEqual);

  useEffect(() => {
    if (props.account != undefined && !props.distributionInitialized) {
      dispatch(initializeDistribution(props.account!));
    }
  }, [props.distributionInitialized, props.account]);

  return <>
    <div>
      {props.distributionInitialized && props.claim == undefined && <div>
        <span className="badge bg-danger">You are not eligible for the airdrop</span>
      </div>}

      {props.distributionInitialized && props.claim !== undefined && <div>
        <Claim claim={props.claim} />
      </div>}
    </div>
  </>;
}
