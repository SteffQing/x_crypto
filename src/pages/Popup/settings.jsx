import React from 'react';
import './Popup';

import Input from '../../components/Input';

const DEFAULT_SLIPPAGES = [0.5, 1, 3];

export default function Settings({
  buyValue,
  setBuyValue,
  slippage,
  setSlippage,
  reset,
  saveSettings,
}) {
  return (
    <main className="container">
      <header className="header header_settings">
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
            <div className="disabled_inputs">
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
          </div>
        </aside>
        <aside className="buy_values">
          <div className="buy_values__header">
            <h2>Buy Values</h2>
            <div className="type_handlers">
              {['%', '0.01'].map((type) => (
                <Input
                  type="radio"
                  value={type}
                  name="type_handler"
                  checked={buyValue.type === type}
                  onChange={() => setBuyValue({ ...buyValue, type })}
                />
              ))}
            </div>
          </div>
        </aside>
        <aside className="buttons"></aside>
      </section>
    </main>
  );
}
