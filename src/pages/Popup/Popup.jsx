import React, { useEffect, useState } from 'react';
import './Popup.css';
import { useAccount, useConnect, useEnsName } from 'wagmi';
import {
  STORAGE_KEY,
  ACCOUNT_KEY,
  TWITTER_ACCOUNT_NAME,
  TWITTER_URL,
} from '../../../utils/constant';
import useIsMounted from '../../hooks/isMounted';
import { displayAddressOrENS } from '../../../utils';
import SwitchBtn from '../../components/SwitchBtn';

export let AccountInfo = null;

const Popup = () => {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({ address });
  const { connect, isLoading, connectors, isError, isSuccess } = useConnect();
  const account = isMounted && address ? address.toLowerCase() : null;
  const [height, setHeight] = useState('');
  const [isViewStat, setViewStat] = useState(false);

  const onClickSwitch = () => {
    setViewStat((prev) => {
      chrome.storage.local.set({ [STORAGE_KEY]: !prev });
      return !prev;
    });
  };

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then((values) => {
      if (values.hasOwnProperty(STORAGE_KEY)) {
        setViewStat(values[STORAGE_KEY]);
      } else {
        setViewStat(true);
        chrome.storage.local.set({ [STORAGE_KEY]: true });
      }
    });
  }, []);

  useEffect(() => {
    console.count('useEffect');
    if (isSuccess || isError) {
      setHeight('');
    }
    let data = { account, ensName, isConnected };
    chrome.storage.local.set({ [ACCOUNT_KEY]: data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <main className="container">
      <header className="header" style={{ height: height }}>
        <h1 className="c-white fs-xl">{`Trading Xtension`}</h1>
        <h1 className="c-white fs-md">{`The Chrome extension for DeFi in Twitter`}</h1>
      </header>

      <section className="section">
        {!isConnected ? (
          // <button
          //   className="button"
          //   onClick={handleConnect}
          //   disabled={isLoading || isConnected || !connectors[0].ready}
          // >
          //   {isLoading ? 'Connecting...' : 'Connect'}
          // </button>
          connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                console.log(connector);
                setHeight('440px');
                connect({ connector });
              }}
            >
              {connector.name}
              {isLoading && ' (connecting)'}
            </button>
          ))
        ) : (
          <>
            <div className="fs-lg c-white">
              {displayAddressOrENS(ensName ? ensName : account)}{' '}
            </div>
            <a
              href={`${TWITTER_URL}/${TWITTER_ACCOUNT_NAME}`}
              target="_blank"
              className="fs-md c-white"
              rel="noreferrer"
            >{`Portfolio`}</a>
          </>
        )}
        {isViewStat !== null && (
          <div onClick={() => onClickSwitch()} className="c-white fs-md">
            {`Turn ${isViewStat ? 'Off' : 'On'} Widget`}{' '}
            <SwitchBtn isChecked={isViewStat} />
          </div>
        )}
      </section>

      <footer className="footer">
        <a
          href={`${TWITTER_URL}/${TWITTER_ACCOUNT_NAME}`}
          target="_blank"
          className="c-gray fs-xs"
          rel="noreferrer"
        >{`Follow Trading Xtension on X`}</a>
      </footer>
    </main>
  );
};

export default Popup;
