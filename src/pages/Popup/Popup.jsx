import React, { useEffect, useState } from 'react';
import './Popup.css';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import {
  STORAGE_KEY,
  ACCOUNT_KEY,
  TWITTER_ACCOUNT_NAME,
  TWITTER_URL,
} from '../../../utils/constant';
import useIsMounted from '../../hooks/isMounted';
import SwitchBtn from '../../components/SwitchBtn';

const Popup = () => {
  const [pk, setPk] = useState('');
  const [err, setErr] = useState('');
  const [height, setHeight] = useState('');
  const [isViewStat, setViewStat] = useState(false);

  const onClickSwitch = () => {
    setViewStat((prev) => {
      chrome.storage.local.set({ [STORAGE_KEY]: !prev });
      return !prev;
    });
  };
  const onChangePk = (e) => {
    let value = e.target.value;
    if (value.length < 66) {
      setErr('Private Key must be 66 characters long');
    } else if (value.slice(0, 2) !== '0x') {
      setErr('Private Key must start with 0x');
    } else {
      setPk(value);
      chrome.storage.local.set({ [ACCOUNT_KEY]: value });
    }
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
    chrome.storage.local.get(ACCOUNT_KEY).then((values) => {
      if (values.hasOwnProperty(ACCOUNT_KEY)) {
        console.log(values[ACCOUNT_KEY], 'Private Key');
        setPk(values[ACCOUNT_KEY]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container">
      <header className="header" style={{ height: height }}>
        <h1 className="c-white fs-xl">{`Trading Xtension`}</h1>
        <h1 className="c-white fs-md">{`The Chrome extension for DeFi in Twitter`}</h1>
      </header>

      <section className="section">
        <div className="flex">
          <label
            className="c-white fs-md"
            htmlFor="input_pk"
          >{`Enter your private key`}</label>
          <input
            type="text"
            onChange={onChangePk}
            placeholder="Enter private key"
            id="input_pk"
          />
          <div className="warning">{err}</div>
        </div>
        {isViewStat !== null && (
          <div onClick={() => onClickSwitch()} className="c-white fs-md">
            {`Turn ${isViewStat ? 'Off' : 'On'} Widget`}{' '}
            <SwitchBtn isChecked={isViewStat} />
          </div>
        )}
      </section>

      <footer className="footer">
        <a
          href={`${TWITTER_URL}`}
          target="_blank"
          className="c-gray fs-xs"
          rel="noreferrer"
        >{`Follow Trading Xtension on X`}</a>
      </footer>
    </main>
  );
};

export default Popup;
