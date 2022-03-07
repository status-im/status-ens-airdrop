import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux';
import { RootState } from "../reducers";
import { initializeDistribution } from "../actions/distribution";
import { Claim } from "../types";
import { initializeContract, claim } from "../actions/contract";
import BN from "bignumber.js";

interface Props {
  claim: Claim
}

const formatAmount = (amount: string, decimals: string) => {
  const a = new BN(amount);
  const d = new BN(decimals);
  return a.div(new BN(10).pow(d)).toString();
}

export default function(ownProps: Props) {
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    initialized: state.contract.initialized,
    contractError: state.contract.error,
    claimed: state.contract.claimed,
    tokenSymbol: state.contract.tokenSymbol,
    tokenDecimals: state.contract.tokenDecimals,
    claiming: state.contract.claiming,
    claimedNow: state.contract.claimedNow,
    claimError: state.contract.claimError,
  }), shallowEqual);

  useEffect(() => {
    if (!props.initialized) {
      dispatch(initializeContract(ownProps.claim));
    }
  }, [props.initialized]);


  const claimHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(claim(ownProps.claim));
  }

  return <>
    {props.initialized && <div>
      <strong>You will receive...</strong> <br />
      {formatAmount(ownProps.claim.amount, props.tokenDecimals!)} {props.tokenSymbol}<br />
    </div>}

    {props.initialized && props.claimed && <div>
      <span className="badge bg-danger">Already claimed.</span>
    </div>}

    {props.initialized && props.contractError !== undefined && <div>
      <span className="badge bg-danger">{props.contractError}</span>
    </div>}

    {props.claimError !== undefined && <div>
      <span className="badge bg-danger">{props.contractError}</span>
    </div>}

    {props.claimedNow ? <>
      <span className="badge bg-success">Claimed correctly.</span>
    </> : <>
      {props.initialized && !props.claimed && props.contractError === undefined && <div className="my-3">
        <button disabled={props.claiming} className="btn btn-primary" onClick={claimHandler}>Claim now</button>
      </div>}
    </>}
  </>;
}
