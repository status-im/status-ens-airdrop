import React, { useEffect } from 'react';
import classNames from 'classnames';
import { RootState } from '../reducers';
import {
  shallowEqual,
  useSelector,
  useDispatch,
} from 'react-redux';
import { initializeWeb3 } from "../actions/web3";

import "../styles/reset.scss";
import "../styles/layout.scss";

interface Props {
  children: JSX.Element
}

export default function(ownProps: Props) {
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => ({
    web3Initialized: state.web3.initialized,
    web3Error: state.web3.error,
    chainID: state.web3.chainID,
    account: state.web3.account,
  }), shallowEqual);

  useEffect(() => {
    if (!props.web3Initialized) {
      dispatch(initializeWeb3());
    }
  }, [props.web3Initialized, props.account, props.web3Error]);

  const connectHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(initializeWeb3());
  }

  return <div className="main">
    <header>
      HEADER
    </header>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>
    {props.web3Error !== undefined && <div>
      {props.web3Error}
    </div>}

    {props.web3Initialized && <div>
      Welcome {props.account} (chainID: {props.chainID})
    </div>}

    {!props.web3Initialized && <div>
      <button onClick={connectHandler}>CONNECT</button>
    </div>}

    <div>
      {ownProps.children}
    </div>
  </div>;
}
