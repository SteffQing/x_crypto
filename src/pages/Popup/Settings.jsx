import React from 'react';
import { Input, InputAdornment } from '../../components/Input';
import { TinyButton, MainButton } from '../../components/Button';
import Radio from '@mui/material/Radio';
import BackArrow from '../../components/BackArrow';
import './Popup.css';
import { Button } from '@mui/material';

const DEFAULT_SLIPPAGES = [0.5, 1, 3];
const BUY_VALUES = ['x1', 'x2', 'x3'];
const Settings = ({
  setPageView,
  slippage,
  setSlippage,
  buyValue,
  setBuyValue,
  saveSettings,
}) => {
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

  return (
    <main className="container">
      <header className="header header_settings">
        <BackArrow className="back_arrow" onClick={() => setPageView(0)} />
        <aside className="header_content header_content_settings">
          <div className="header_text">
            <h1 className="c-white fs-xl">{`Settings`}</h1>
          </div>
        </aside>
      </header>

      <section className="section section_settings">
        <aside className="slippage">
          <h2>Max. slippage</h2>
          <div className="slippage__inputs">
            <Input
              type="number"
              placeholder="0.5%"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="slippage__input"
              id="slippage-start"
              endAdornment={<InputAdornment>%</InputAdornment>}
            />
            <div className="disabled_inputs">
              {DEFAULT_SLIPPAGES.map((value) => (
                <TinyButton
                  onClick={() => {
                    console.log(value, '% clicked');
                    setSlippage(value);
                  }}
                  variant="outlined"
                >
                  {value}%
                </TinyButton>
              ))}
            </div>
          </div>
        </aside>
        <aside className="buy_values">
          <div className="buy_values__header">
            <h2>Buy Values</h2>
            <div className="type_handlers">
              {['percent', 'number'].map((type) => (
                <div>
                  <Radio
                    checked={buyValue.type === type}
                    onChange={() => setBuyValue({ ...buyValue, type })}
                    value={type}
                    name="types"
                    inputProps={{ 'aria-label': type }}
                  />
                  <label
                    style={{
                      color:
                        type === buyValue.type
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.5)',
                      fontSize: '1rem',
                    }}
                  >
                    {type === 'percent' ? '%' : '0.01'}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="buy_values__content">
            {BUY_VALUES.map((value) => (
              <div className="buy_values_input">
                <Button variant="contained" disabled id="disabled_button">
                  {value}
                </Button>
                <Input
                  type="number"
                  placeholder={buyValue[value]}
                  value={buyValue[value]}
                  onChange={(e) =>
                    setBuyValue({
                      ...buyValue,
                      [value]: Number(e.target.value),
                    })
                  }
                  className="slippage__input"
                  id={value}
                  endAdornment={
                    <InputAdornment>
                      {buyValue.type === 'percent' ? '%' : 'ETH'}
                    </InputAdornment>
                  }
                />
              </div>
            ))}
          </div>
        </aside>
        <aside className="buttons">
          <MainButton onClick={saveSettings}>Apply</MainButton>
          <Button size="large" id="btn_2" onClick={reset}>
            Reset to default
          </Button>
        </aside>
      </section>
    </main>
  );
};

export default Settings;
