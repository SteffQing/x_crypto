import React, { useEffect } from 'react';
import './Popup.css';

import mainImg from "../../assets/img/main-img.png"

import SwitchBtn from "../../components/SwitchBtn"
import { useState } from 'react';
import { STORAGE_KEY, TWITTER_ACCOUNT_NAME, TWITTER_URL } from '../../../utils/constant';


const Popup = () => {
  const [isViewStat, setViewStat] = useState(null)

  const onClickSwitch = () => {
    setViewStat((prev) => {
      chrome.storage.local.set({ [STORAGE_KEY]: !prev })
      return !prev
    })
  }

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then((values) => {
      if (values.hasOwnProperty(STORAGE_KEY)) {
        setViewStat(values[STORAGE_KEY])
      } else {
        setViewStat(true)
        chrome.storage.local.set({ [STORAGE_KEY]: true })
      } 
    })
  }, [])
  
  return (
    <main className="ex-container">

      <header className="ex-header">
        <img src={mainImg} className="main-logo mt-48" alt="main-logo" width={56} height={56}/>
        <h1 className="c-white main-txt-adj">{`Friend.tech Gems`}</h1>
        <h2 className="c-white fs-sm">{`Find gems and make friends`}</h2>
      </header>
      
      <section className="ex-body" >
        <span className='c-black fs-xs'>{`View Stats`}</span>
        {isViewStat !== null &&
          <div onClick={() => onClickSwitch()}>
            <SwitchBtn isChecked={isViewStat} />
          </div>
        }
      </section>
      
      <footer className="ex-footer">
        <a href={`${TWITTER_URL}/${TWITTER_ACCOUNT_NAME}`} target="_blank" className='c-gray fs-xs' rel="noreferrer">{`Follow us on X @${TWITTER_ACCOUNT_NAME}`}</a>
      </footer>
    </main>
  );
};

export default Popup;

