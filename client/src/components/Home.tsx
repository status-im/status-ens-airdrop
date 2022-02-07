import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux';
import { RootState } from "../reducers";
import { initializeWeb3 } from "../actions/web3";

export default function() {
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    initialized: state.web3.initialized,
    chainID: state.web3.chainID,
    account: state.web3.account,
  }), shallowEqual);

  useEffect(() => {
    if (!props.initialized) {
      dispatch(initializeWeb3());
    }
  }, [props.initialized]);

  const connectHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(initializeWeb3());
  }

  return <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      <br />
      {props.initialized && <>
        Welcome {props.account} (chainID: {props.chainID})
      </>}

      {!props.initialized && <>
        <button onClick={connectHandler}>CONNECT</button>
      </>}
    </p>
  </>;
}
