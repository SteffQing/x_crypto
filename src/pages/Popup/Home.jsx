import React from 'react';
import { TWITTER_URL } from '../../../utils/constant';
import SwitchBtn from '../../components/SwitchBtn';
import Copy from '../../components/Copy';
import SettingsIcon from '../../components/Settings';
import './Popup.css';

export default function Homepage({
  pk,
  isViewStat,
  err,
  onChangePk,
  onClickSwitch,
  setView,
}) {
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
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(pk.account);
                }}
              />
            </div>
            <div className="setting">
              <span onClick={() => setView(1)}>
                <SettingsIcon />
              </span>
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
}
