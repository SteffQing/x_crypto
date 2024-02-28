import React, { useEffect, useState } from 'react';
import './Popup.css';
import {
  STORAGE_KEY,
  ACCOUNT_KEY,
  SETTINGS_KEY,
} from '../../../utils/constant';
// import { decrypt, encrypt } from '../../../utils/hash';
import { Wallet } from 'ethers';
import HomePage from './Homepage';
import Settings from './Settings';

const Popup = () => {
  const [pk, setPk] = useState(null);
  const [err, setErr] = useState('');
  const [isViewStat, setViewStat] = useState(false);
  const [pageView, setPageView] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [buyValue, setBuyValue] = useState({
    x1: 10,
    x2: 20,
    x3: 30,
    type: 'percent',
  });

  const onClickSwitch = () => {
    setViewStat((prev) => {
      chrome.storage.local.set({ [STORAGE_KEY]: !prev });
      return !prev;
    });
  };
  const onChangePk = (e) => {
    let value = e.target.value;
    // console.log(value, 'Original');
    // let ddd = encrypt(value);
    // console.log(ddd, 'Encrypted');
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

  const saveSettings = () =>
    chrome.storage.local.set({ [SETTINGS_KEY]: { buyValue, slippage } });

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
    chrome.storage.local.get(SETTINGS_KEY).then((values) => {
      if (values.hasOwnProperty(SETTINGS_KEY)) {
        let { buyValue, slippage } = values[SETTINGS_KEY];
        setBuyValue(buyValue);
        setSlippage(slippage);
      } else {
        chrome.storage.local.set({ [SETTINGS_KEY]: { buyValue, slippage } });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {pageView === 0 ? (
        <HomePage
          pk={pk}
          err={err}
          isViewStat={isViewStat}
          onChangePk={onChangePk}
          onClickSwitch={onClickSwitch}
          setPageView={setPageView}
        />
      ) : (
        <Settings
          setPageView={setPageView}
          slippage={slippage}
          setSlippage={setSlippage}
          buyValue={buyValue}
          setBuyValue={setBuyValue}
          saveSettings={saveSettings}
        />
      )}
    </>
  );
};

export default Popup;
