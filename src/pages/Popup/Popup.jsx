import React, { useEffect, useState } from 'react';
import './Popup.css';
import { useAccount, useConnect, useEnsName } from 'wagmi';
import { STORAGE_KEY, TWITTER_ACCOUNT_NAME, TWITTER_URL } from '../../../utils/constant';
import useIsMounted from '../../hooks/isMounted';
import { displayAddressOrENS } from '../../../utils';
import SwitchBtn from '../../components/SwitchBtn';

const Popup = () => {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({ address });
  const { connect, isLoading, connectors, isError, isSuccess } = useConnect();
  const account = isMounted && address ? address.toLowerCase() : null;
  const [height, setHeight] = useState('');
  const [isViewStat, setViewStat] = useState(false)

  const onClickSwitch = () => {
    setViewStat((prev) => {
      chrome.storage.local.set({ [STORAGE_KEY]: !prev })
      return !prev
    })
  }

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then((values) => {
      if (values.hasOwnProperty(STORAGE_KEY)) {
        setViewStat(values[STORAGE_KEY])
      } else {
        setViewStat(true)
        chrome.storage.local.set({ [STORAGE_KEY]: true })
      } 
    })
  }, [])

  const handleConnect = () => {
    setHeight('440px');
    connect({ connector: connectors[0] });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setHeight('');
    }
  }, [isSuccess, isError]);

  return (
    <main className="container">
      <header className="header" style={{ height: height }}>
        <h1 className="c-white fs-xl">{`X_DeFi`}</h1>
        <h1 className="c-white fs-md">{`The Chrome extension for DeFi Twitter`}</h1>
      </header>

      <section className="section">
        {!isConnected ? (
          <button
            className="button"
            onClick={handleConnect}
            disabled={isLoading || isConnected || !connectors[0].ready}
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
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
        {isViewStat !== null &&
          <div onClick={() => onClickSwitch()} className="c-white fs-md">
           {`Turn off Widget`} <SwitchBtn isChecked={isViewStat} />
          </div>
        }
      </section>

      <footer className="footer">
        <a
          href={`${TWITTER_URL}/${TWITTER_ACCOUNT_NAME}`}
          target="_blank"
          className="c-gray fs-xs"
          rel="noreferrer"
        >{`Follow X_DeFi on Twitter`}</a>
      </footer>
    </main>
  );
};

export function AccountInfo(){
  
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({ address });
  const account = isMounted && address ? address.toLowerCase() : null;

  return {
    account,
    isConnected,
    ensName}
}

export default Popup;
