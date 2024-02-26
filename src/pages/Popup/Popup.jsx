import React, { useEffect, useState } from 'react';
import './Popup.css';
import { STORAGE_KEY, ACCOUNT_KEY } from '../../../utils/constant';
import { Wallet } from 'ethers';
import HomePage from './Homepage';
import Settings from './Settings';

const Popup = () => {
  const [pk, setPk] = useState(null);
  const [err, setErr] = useState('');
  const [isViewStat, setViewStat] = useState(false);
  const [pageView, setPageView] = useState(0);

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
        <Settings />
      )}
    </>
  );
};

export default Popup;
