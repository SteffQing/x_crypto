import { cashtag_regex } from '../../../utils';
import {
  CLASS_FOR_TAG,
  MS_GET_TOKEN_INFO,
  STORAGE_KEY,
} from '../../../utils/constant';

const dataMap = new Map();

const fontColor = '#888';
const emphasizeColor = '#d2d2d2';

console.log('content');

const onMutation = (mutations) => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node) {
        if (node.dataset && node.dataset.testid) {
          // console.log("node.dataset.testid=" + node.dataset.testid)
          if (node.dataset.testid === 'cellInnerDiv') {
            fetchAndAttach(node);
          }
        }
      }
    }
  }
  return true;
};

const mo = new MutationObserver(onMutation);
const startProcess = () => {
  mo.observe(document, {
    subtree: true,
    childList: true,
  });

  fetchAndAttach();
};

const stopProcess = () => {
  mo.disconnect();
  const tags = document.querySelectorAll(`.${CLASS_FOR_TAG}`);
  tags.forEach((tag) => tag.remove());
};

const fetchAndAttach = async (node) => {
  console.log('fetchAndAttach');

  const cashtags = getTweetCashtags(node);
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

const getTweetCashtags = (node) => {
  const tweets = node.querySelectorAll("[data-testid='tweetText']");
  const linkUrls = Array.from(tweets)
    .map((content) => {
      let cashtag_className = null;
      const links = Array.from(content.querySelectorAll('a')).map((element) => {
        cashtag_className = element.textContent.replace('$', '').toUpperCase();
        return element.href;
      });
      const match = links.some((url) => cashtag_regex.test(url));
      if (match) {
        content.classList.add(cashtag_className);
      }
      return links;
    })
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
      const checkLastTag = selectedTweetTag.querySelector(`.${cashtag}`);
      if (matchedTag) {
        if (checkLastTag) {
          checkLastTag.remove();
        }
        const newDiv = createInfo(matchedTag);
        selectedTweetTag.appendChild(newDiv);
      }
    }
  }
}

function createInfo(tokenInfo) {
  const newDiv = document.createElement('div');

  let { twitter, symbol, imageThumbUrl, priceChange, volume, address, price } =
    tokenInfo;

  newDiv.classList.add(symbol);
  newDiv.id = symbol;
  newDiv.style.display = 'block';
  newDiv.style.fontFamily = 'TwitterChirp';
  newDiv.style.border = '1px solid #d2d2d2';
  newDiv.style.borderRadius = '4px';
  newDiv.style.padding = '4px 8px';
  newDiv.style.margin = '4px 0px';
  newDiv.style.fontSize = '12px';
  newDiv.style.color = fontColor;

  // Image and Symbol
  const imageNode = createImage(imageThumbUrl, symbol);
  const symbolNode = createSpan(symbol);
  symbol.insertAdjacentElement('beforebegin', imageNode);

  // Price, 24H Change and Volume
  const priceNode = createSpan(`💲 ${price}`);
  const priceChangeNode = createSpan(`📈 ${priceChange}%`);
  const volumeNode = createSpan(`💹 ${volume}`);

  // Address and Link
  const addressShort = `${address.substring(0, 6)}...${address.slice(-4)}`;
  const addressLink = createLink(`https://www.defined.fi/${address}`);
  const addressNode = createSpan(addressShort);
  addressLink.appendChild(addressNode);

  newDiv.appendChild(symbolNode);
  newDiv.appendChild(priceNode);
  newDiv.appendChild(priceChangeNode);
  newDiv.appendChild(volumeNode);
  newDiv.appendChild(addressLink);

  // Socials
  if (twitter) {
    const twitterLink = createLink(`https://twitter.com/${twitter}`);
    const twitterNode = createSpan(`🐦 @${twitter}`);
    twitterLink.appendChild(twitterNode);
    newDiv.appendChild(twitterLink);
  }

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

function createImage(url, symbol) {
  const image = document.createElement('img');
  image.src = url;
  image.style.width = '16px';
  image.style.height = '16px';
  image.style.verticalAlign = 'middle';
  image.style.display = 'inline';
  image.alt = symbol;
  return image;
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
