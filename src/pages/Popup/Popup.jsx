import React, { useEffect, useState } from 'react';
import './Popup.css';
import {
  STORAGE_KEY,
  ACCOUNT_KEY,
  SETTINGS_KEY,
} from '../../../utils/constant';
import { Wallet } from 'ethers';
import Homepage from './Home';
import Settings from './Settings';

const Popup = () => {
  const [view, setView] = useState(0);
  const [pk, setPk] = useState(null);
  const [err, setErr] = useState('');
  const [isViewStat, setViewStat] = useState(false);
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
  const reset = () => {
    setSlippage(0.5);
    setBuyValue({
      x1: 10,
      x2: 20,
      x3: 30,
      type: 'percent',
    });
    saveSettings();
  };
  const saveSettings = () => {
    chrome.storage.local.set({ [SETTINGS_KEY]: { slippage, buyValue } });
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
    chrome.storage.local.get(SETTINGS_KEY).then((values) => {
      if (values.hasOwnProperty(SETTINGS_KEY)) {
        setSlippage(values[SETTINGS_KEY].slippage);
        setBuyValue(values[SETTINGS_KEY].buyValue);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return view === 0 ? (
    <Homepage
      setView={setView}
      pk={pk}
      isViewStat={isViewStat}
      err={err}
      onChangePk={onChangePk}
      onClickSwitch={onClickSwitch}
    />
  ) : (
    <Settings
      buyValue={buyValue}
      setBuyValue={setBuyValue}
      slippage={slippage}
      setSlippage={setSlippage}
      reset={reset}
      saveSettings={saveSettings}
    />
  );
};

export default Popup;
