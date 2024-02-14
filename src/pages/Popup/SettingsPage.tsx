import React, { useEffect, useState } from 'react';
import './Popup.css';
// import { STORAGE_KEY, ACCOUNT_KEY } from '../../../utils/constant';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const DEFAULT_SLIPPAGES = [0.5, 1, 3];
const Settings = () => {
  const [pk, setPk] = useState(null);
  const [slippage, setSlippage] = useState(0.5);

  useEffect(() => {
    // chrome.storage.local.get(ACCOUNT_KEY).then((values) => {
    //   if (values.hasOwnProperty(ACCOUNT_KEY)) {
    //     setPk(values[ACCOUNT_KEY]);
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container">
      <header className="header">
        <aside className="header_content">
          <div className="header_text">
            <h1 className="c-white fs-xl">{`Settings`}</h1>
          </div>
        </aside>
      </header>

      <section className="section">
        <aside className="slippage">
          <h2>Max. slippage</h2>
          <div className="slippage__inputs">
            <Input
              type="number"
              placeholder="0.5%"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="slippage__input"
            />
            {DEFAULT_SLIPPAGES.map((value) => (
              <Input
                type="number"
                value={`${value}%`}
                disabled={slippage !== value}
                onClick={() => setSlippage(value)}
                className="slippage__input__disbled"
              />
            ))}
          </div>
        </aside>
        <aside className="buy_values">
          <div className="buy_values__header">
            <h2>Buy Values</h2>
          </div>
        </aside>
        <aside className="buttons"></aside>
      </section>
    </main>
  );
};

export default Settings;
