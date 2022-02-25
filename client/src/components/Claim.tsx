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

interface Props {
  claim: Claim
}

export default function(ownProps: Props) {
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    initialized: state.contract.initialized,
    contractError: state.contract.error,
    claimed: state.contract.claimed,
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
      <strong>Claim</strong>: <br />
      Index: {ownProps.claim.index} <br />
      Address: {ownProps.claim.address} <br />
      Amount: {ownProps.claim.amount} <br />
      Proof: {ownProps.claim.proof && ownProps.claim.proof.join(", ")} <br />
    </div>}

    {props.initialized && props.claimed && <div>
      Already claimed.
    </div>}

    {props.initialized && props.contractError !== undefined && <div>
      {props.contractError}
    </div>}

    {props.initialized && !props.claimed && props.contractError === undefined && <div>
      <button className="btn btn-primary" onClick={claimHandler}>Claim now</button>
    </div>}
  </>;
}
