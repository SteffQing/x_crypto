import React from 'react';
import './Popup.css';
import {
  Button,
  FormControlLabel,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const DEFAULT_SLIPPAGES = [0.5, 1, 3];

export default function Settings({
  buyValue,
  setBuyValue,
  slippage,
  setSlippage,
  reset,
  saveSettings,
  setView,
}) {
  return (
    <main className="container">
      <header className="header header_settings">
        <ArrowLeftIcon onClick={() => setView(0)} className="return_button" />
        <aside className="header_content">
          <div className="header_text">
            <h1 className="c-white fs-xl">{`Settings`}</h1>
          </div>
        </aside>
      </header>

      <section className="section settings_section">
        <aside className="slippage">
          <h2>Max. slippage</h2>
          <div className="slippage__inputs">
            <Input
              type="number"
              placeholder="0.5%"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="slippage__input"
              endAdornment={
                <InputAdornment position="end" className="input_adornment">
                  %
                </InputAdornment>
              }
              aria-describedby="slippage-amount"
            />
            <div className="disabled_inputs">
              {DEFAULT_SLIPPAGES.map((value) => (
                <Button
                  variant="outlined"
                  className="slippage__input__disbled"
                  onClick={() => setSlippage(value)}
                  size="small"
                  disabled={slippage === value}
                >{`${value}%`}</Button>
              ))}
            </div>
          </div>
        </aside>
        <aside className="buy_values">
          <div className="buy_values__header">
            <h2>Buy Values</h2>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={buyValue.type}
              onChange={(e) =>
                setBuyValue({
                  ...buyValue,
                  type: e.target.value,
                })
              }
              className="type_handlers"
            >
              {['%', '0.01'].map((type) => (
                <FormControlLabel
                  value={type === '%' ? 'percent' : 'amount'}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </div>
          <div className="buy_values__content">
            {['x1', 'x2', 'x3'].map((key) => (
              <div className="buy_value">
                <Button
                  variant="outlined"
                  className="slippage__input__disbled"
                  size="small"
                  disabled
                >
                  {key.toUpperCase()}
                </Button>
                <Input
                  type="number"
                  placeholder={10 * Number(key.slice(-1))}
                  value={buyValue[key]}
                  onChange={(e) =>
                    setBuyValue({ ...buyValue, [key]: Number(e.target.value) })
                  }
                  className="slippage__input"
                  endAdornment={
                    <InputAdornment position="end" className="input_adornment">
                      {buyValue.type === 'percent' ? '%' : 'ETH'}
                    </InputAdornment>
                  }
                  aria-describedby="buy-amount"
                />
              </div>
            ))}
          </div>
        </aside>
        <aside className="setting_buttons">
          <Button
            variant="contained"
            onClick={saveSettings}
            className="apply_button"
          >
            Apply
          </Button>
          <Button variant="text" onClick={reset} className="reset_button">
            Reset to default
          </Button>
        </aside>
      </section>
    </main>
  );
}
