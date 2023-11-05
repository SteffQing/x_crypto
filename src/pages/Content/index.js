import { cashtag_regex } from '../../../utils';
import {
  CLASS_FOR_TAG,
  MS_GET_TOKEN_INFO,
  STORAGE_KEY,
} from '../../../utils/constant';

const INTERVAL_MS = 2000;

const dataMap = new Map();

const fontColor = '#888';
const emphasizeColor = '#d2d2d2';

let intervalId = null;

console.log('content');

//

const startProcess = () => {
  intervalId = setInterval(fetchAndAttach, INTERVAL_MS);
  console.log('Start');
  fetchAndAttach();
};

const stopProcess = () => {
  clearInterval(intervalId);
  intervalId = null;
  const tags = document.querySelectorAll(`.${CLASS_FOR_TAG}`);
  tags.forEach((tag) => tag.remove());
};

const fetchAndAttach = async () => {
  console.log('fetchAndAttach');

  const cashtags = getTweetCashtags();
  const newCashTags = cashtags.filter((cashtag) => !dataMap.has(cashtag));

  try {
    if (newCashTags.length > 0) {
      await getTokensInfo(newCashTags);
    }
    attachInfoTag();
  } catch (error) {
    console.error(error);
  }
};

const getTweetCashtags = () => {
  const tweets = Array.from(
    document.querySelectorAll("[data-testid='tweetText']")
  );

  const linkUrls = tweets
    .map((content) =>
      Array.from(content.querySelectorAll('a'))
        .map((element) => element.href)
        .filter((url) => cashtag_regex.test(url))
    )
    .flat();

  return FromLinksToCashtags(linkUrls);
};

const FromLinksToCashtags = (urls) => {
  const uniqueCashTags = new Set();

  for (let url of urls) {
    let [i1, i2] = [url.indexOf('%24'), url.indexOf('&src')];
    let token = url.slice(i1 + 3, i2);
    if (token.length >= 3 && token.length <= 5) {
      uniqueCashTags.add(token.toUpperCase());
    }
  }

  return Array.from(uniqueCashTags);
};

const setTokensInfo = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }
  data.forEach((value) => {
    dataMap.set(value.symbol, value);
  }, {});
};

const getTokensInfo = async (cashtags) => {
  return new Promise((resolve, reject) => {
    const msg = {
      action: MS_GET_TOKEN_INFO,
      cashtags,
    };
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        setTokensInfo(response);
        resolve('ok');
      }
    });
  });
};

function attachInfoTag() {
  const selectedTweetTag = document.querySelector("[data-testid='tweetText']");
  if (selectedTweetTag) {
    const children = selectedTweetTag.children;
    const cashtag_spans = Array.from(children).filter(
      (child) => Array.from(child.classList).length === 1
    );
    for (let cashtag_span of cashtag_spans) {
      let cashtag = cashtag_span.textContent.replace('$', '').toUpperCase();
      const matchedTag = dataMap.get(cashtag);
      // const checkLastTag = selectedTweetTag.querySelector(`.${CLASS_FOR_TAG}`);
      const checkLastTag = selectedTweetTag.querySelector(`#${cashtag}`);
      if (matchedTag) {
        if (checkLastTag) {
          checkLastTag.remove();
        }
        // const newDiv = createInfo(matchedTag);
        console.log('Matched Tag: ', matchedTag);
        console.log('check last Tag: ', checkLastTag);
        // selectedTweetTag.appendChild(newDiv);
      }
    }
  }
}

function createInfo(tokenInfo) {
  const newDiv = document.createElement('div');

  // newDiv.classList.add(CLASS_FOR_TAG);
  newDiv.id = tokenInfo.symbol;
  newDiv.style.display = 'block';
  newDiv.style.fontFamily = 'TwitterChirp';
  newDiv.style.border = '1px solid #d2d2d2';
  newDiv.style.borderRadius = '4px';
  newDiv.style.padding = '4px 8px';
  newDiv.style.margin = '4px 0px';
  newDiv.style.fontSize = '12px';
  newDiv.style.color = fontColor;

  const price = tokenInfo.price;

  const addressLink = createLink(
    `https://friend.tech/rooms/${tokenInfo.address}`
  );
  const trophyAndPriceLink = createLink(
    `https://friendmex.com/?address=${tokenInfo.address}`
  );

  const content = `${price}   📭 `;
  const addressShort = `${tokenInfo.address.substring(
    0,
    6
  )}...${tokenInfo.address.slice(-4)}`;

  const displayNode = createSpan(content);
  const addressNode = createSpan(addressShort);

  addressLink.appendChild(addressNode);
  trophyAndPriceLink.appendChild(displayNode);

  newDiv.appendChild(trophyAndPriceLink);
  newDiv.appendChild(addressLink);
  return newDiv;
}

function createLink(href) {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.textDecoration = 'none';
  link.style.display = 'inline';

  link.addEventListener('mouseover', () => {
    Array.from(link.children).forEach((child) => {
      child.style.color = emphasizeColor;
    });
  });

  link.addEventListener('mouseout', () => {
    Array.from(link.children).forEach((child) => {
      child.style.color = fontColor;
    });
  });
  return link;
}

function createSpan(text, className = '') {
  const span = document.createElement('span');
  span.textContent = text;
  span.className = `${className}`;
  span.style.fontSize = '12px';
  span.style.color = fontColor;
  return span;
}

chrome.storage.local.get(STORAGE_KEY).then((values) => {
  if (values.hasOwnProperty(STORAGE_KEY) && values[STORAGE_KEY]) {
    setTimeout(startProcess, 300);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes, namespace);
  for (let key in changes) {
    if (key === STORAGE_KEY) {
      const newValue = changes[key].newValue;
      if (newValue) {
        console.log('start interval');
        startProcess();
      } else {
        console.log('stop interval');
        stopProcess();
      }
    }
  }
});
