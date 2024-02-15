import React, { useEffect, useState } from 'react';
import './Popup.css';
import { STORAGE_KEY, ACCOUNT_KEY, TWITTER_URL } from '../../../utils/constant';
import SwitchBtn from '../../components/SwitchBtn';
import Copy from '../../components/Copy';
import Settings from '../../components/Settings';
import { Wallet } from 'ethers';

const Popup = () => {
  const [pk, setPk] = useState(null);
  const [err, setErr] = useState('');
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
      const wallet = new Wallet(value);
      const data = { account: wallet.address, privateKey: value };
      setPk(data);
      chrome.storage.local.set({ [ACCOUNT_KEY]: data });
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
        setPk(values[ACCOUNT_KEY]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container">
      <header className="header">
        <aside className="header_content">
          <img
            src="./main-img.png"
            alt="xTrade Logo"
            width="100px"
            height="100px"
          />
          <div className="header_text">
            <h1 className="c-white fs-xl">{`Trading Xtension`}</h1>
            <h3 className="c-white fs-md">{`The Chrome extension for DeFi on X`}</h3>
          </div>
        </aside>
      </header>

      <section className="section">
        {!pk ? (
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
        ) : (
          <div className="wallet_setting">
            <div className="wallet">
              <a
                className="fs-md"
                href={TWITTER_URL + pk.account}
                target="_blank"
                rel="noreferrer"
              >
                {`${pk.account.substring(0, 7)}...${pk.account.slice(-5)}`}
              </a>
              <Copy />
            </div>
            <div className="setting">
              <a href="/settings.html">
                <Settings />
              </a>
            </div>
          </div>
        )}
        {isViewStat !== null && (
          <div onClick={() => onClickSwitch()} className="c-white fs-md m-auto">
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
