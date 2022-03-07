import React, { useEffect } from 'react';
import classNames from 'classnames';
import { RootState } from '../reducers';
import {
  shallowEqual,
  useSelector,
  useDispatch,
} from 'react-redux';
import { initializeWeb3 } from "../actions/web3";

import "../../node_modules/bootstrap/scss/bootstrap.scss";
import "../styles/main.scss";

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

  return <div className="container">
    {props.web3Error !== undefined && <div>
      <div className="alert alert-danger col-12 col-lg-8 offset-lg-2" role="alert">
        {props.web3Error}
      </div>
    </div>}

    <section className="row justify-content-lg-center">
      <div className="col-12 col-lg-8">
        <div className="main-card card mt-5">
          <div className="card-body">
            <h5 className="card-title">
              Claim your ENS tokens
            </h5>
            <div className="card-text mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>

            {!props.web3Error && <>
              {props.web3Initialized && <div className="mb-2">
                Welcome {props.account} (chainID: {props.chainID})
              </div>}

              <div>
                {ownProps.children}
              </div>
              </>}

            {!props.web3Initialized && <div className="my-2">
              <button className="btn btn-primary" onClick={connectHandler}>CONNECT</button>
            </div>}

            <footer>
              footer copy
            </footer>
          </div>
        </div>
      </div>
    </section>
  </div>;
}
