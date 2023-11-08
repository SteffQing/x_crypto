import { num } from '../../../server/fragments';
import {
  cashtag_regex,
  formatVolume,
  stripPrice,
  stripSocials,
} from '../../../utils';
import {
  CLASS_FOR_TAG,
  MS_GET_TOKEN_INFO,
  STORAGE_KEY,
} from '../../../utils/constant';
import { createChart } from 'lightweight-charts';
import { candleSeriesSettings, chartOptions } from './Chart';
import { Networks } from './Networks';

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

  try {
    addPortfolio();
  } catch (error) {
    console.log('Error: ', error.message);
    setTimeout(() => {
      console.log('Retrying after 5 seconds...');
      addPortfolio();
    }, 5000);
  }
};

const addPortfolio = () => {
  const tab = document.querySelector("[aria-label='Primary']");
  const firstChild = tab.firstChild;
  const portfolio = firstChild.cloneNode(true);
  createPortfolioSVG(portfolio);
  portfolio.ariaLabel = 'View your Portfolio';
  portfolio.role = 'Portfolio';
  portfolio.dataset.testid = 'Portfolio Tab';
  window.addEventListener('resize', () => {
    console.log('resize');
    if (window.innerWidth > 1280) {
      const spanElementOld = portfolio.querySelector('span');
      if (spanElementOld) return;
      const parentNode =
        firstChild.firstChild.firstChild.nextSibling.cloneNode(true);
      const spanElement = parentNode.querySelector('span');
      spanElement.textContent = 'Portfolio';
      portfolio.firstChild.appendChild(parentNode);
    } else {
      const spanElement = portfolio.querySelector('span');
      if (spanElement) {
        const parentNode = spanElement.parentNode;
        parentNode.remove();
      }
    }
  });

  tab.insertBefore(portfolio, firstChild.nextSibling);
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
    attachInfoTag(node);
  } catch (error) {
    console.error(error);
  }
};

const getTweetCashtags = (node) => {
  try {
    const tweets = node.querySelectorAll("[data-testid='tweetText']");
    const linkUrls = Array.from(tweets)
      .map((content) =>
        Array.from(content.querySelectorAll('a'))
          .map((element) => element.href)
          .filter((url) => cashtag_regex.test(url))
      )
      .flat();

    return FromLinksToCashtags(linkUrls);
  } catch (error) {
    console.log('Tweets lookup error: ', error.message || "Can't find tweets");
    return [];
  }
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

function attachInfoTag(node) {
  const selectedTweets = node.querySelectorAll("[data-testid='tweetText']");
  for (let selectedTweetTag of selectedTweets) {
    const children = selectedTweetTag.children;
    const cashtag_spans = Array.from(children).filter(
      (child) => Array.from(child.classList).length === 1
    );
    for (let cashtag_span of cashtag_spans) {
      let cashtag = cashtag_span.textContent.replace('$', '').toUpperCase();
      const matchedTag = dataMap.get(cashtag);
      const checkLastTag = selectedTweetTag.querySelector(`.${CLASS_FOR_TAG}`);
      if (matchedTag) {
        if (checkLastTag) {
          checkLastTag.remove();
        }
        const newDiv = createInfo(matchedTag);
        const firstChild = selectedTweetTag.firstChild;
        selectedTweetTag.insertBefore(newDiv, firstChild);
        cashtag_span.addEventListener('mouseover', () => {
          const recentTag = selectedTweetTag.querySelector(`.${CLASS_FOR_TAG}`);
          if (recentTag) {
            recentTag.remove();
          }
          const _firstChild = selectedTweetTag.firstChild;
          selectedTweetTag.insertBefore(newDiv, _firstChild);
        });
      }
    }
  }
}

function createInfo(tokenInfo) {
  const newDiv = document.createElement('div');

  let {
    twitter,
    symbol,
    imageThumbUrl,
    priceChange,
    volume,
    address,
    networkId,
    price,
    bar,
  } = tokenInfo;

  newDiv.classList.add(CLASS_FOR_TAG);
  newDiv.id = symbol;
  newDiv.style.display = 'flex';
  newDiv.style.alignItems = 'center';
  newDiv.style.justifyContent = 'space-between';
  newDiv.style.backgroundColor = '#fff';
  newDiv.style.gap = '6px';
  newDiv.style.fontFamily = 'TwitterChirp';
  newDiv.style.border = '1px solid #d2d2d2';
  newDiv.style.borderRadius = '4px';
  newDiv.style.padding = '4px 8px';
  newDiv.style.margin = '4px 0px';
  newDiv.style.fontSize = '12px';
  newDiv.style.position = 'relative';
  newDiv.style.color = fontColor;

  // Image and Symbol
  const imageNode = createImage(imageThumbUrl, symbol);
  const symbolNode = createSpan(symbol);
  const imageSymbolNode = createDiv(imageNode, symbolNode);

  // Price, 24H Change and Volume
  const priceNode = createSpan(`${price}`, true);
  const priceChangeNode = createSpan(`📈 ${num(priceChange).toFixed(2)}%`);
  const volumeNode = createSpan(`💹 $${formatVolume(volume)}`);

  // Chart and Buy/Sell
  const chartNode = createChartNode(bar, newDiv);
  const viewChartNode = createSpan('📊 Chart');
  viewChartNode.addEventListener('mouseover', () => {
    chartNode.style.display = 'block';
    chartNode.style.top = newDiv.offsetHeight + 'px';
    chartNode.style.width = newDiv.offsetWidth + 'px';
  });
  viewChartNode.addEventListener('mouseout', () => {
    setTimeout(() => {
      chartNode.style.display = 'none';
    }, 5000);
  });
  const viewBuySellModal = createSpan('💱 Trade');

  // Address and Link
  const network = Networks.find((network) => network.id === networkId).name;
  const addressShort = `⛓️${address.substring(0, 4)}...${address.slice(-3)}`;
  const addressLink = createLink(
    `https://www.defined.fi/${network}/${address}`
  );
  const addressNode = createSpan(addressShort);
  addressLink.appendChild(addressNode);

  newDiv.appendChild(imageSymbolNode);
  newDiv.appendChild(priceNode);
  newDiv.appendChild(priceChangeNode);
  newDiv.appendChild(volumeNode);
  newDiv.appendChild(addressLink);

  // Socials
  if (twitter) {
    const twitterLink = createLink(twitter);
    const twitterNode = createSpan(`🐦 @${stripSocials(twitter)}`);
    twitterLink.appendChild(twitterNode);
    newDiv.appendChild(twitterLink);
  }
  newDiv.appendChild(viewChartNode);
  newDiv.appendChild(viewBuySellModal);
  newDiv.appendChild(chartNode);

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
  image.style.borderRadius = '50%';
  image.alt = symbol;
  return image;
}

function createSpan(text, type = false) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'nowrap';
  if (type) {
    const { subscript, value } = stripPrice(text);
    if (!subscript) {
      span.textContent = `💲${value}`;
      return span;
    }
    if (Number(subscript) === -1) {
      span.textContent = `💲0.${value}`;
      return span;
    }
    if (Number(subscript) === 0) {
      span.textContent = `💲0.0${value}`;
      return span;
    }
    const subscriptNode = document.createElement('sub');
    subscriptNode.textContent = subscript;
    subscriptNode.style.fontSize = '8px';

    const container = document.createElement('span');
    const zeroText = document.createTextNode('💲0.0');

    // Append the parts to the container
    container.appendChild(zeroText);
    container.appendChild(subscriptNode);
    container.appendChild(document.createTextNode(value));

    // Append the container to the parent span element
    span.appendChild(container);
  } else span.textContent = text;

  return span;
}

function createDiv(element1, element2) {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.gap = '4px';

  div.appendChild(element1);
  div.appendChild(element2);

  return div;
}

function createChartNode(chartData) {
  const chartElement = document.createElement('div');

  const chart = createChart(chartElement, chartOptions);
  const candleSeries = chart.addCandlestickSeries(candleSeriesSettings);
  candleSeries.setData(chartData);

  chartElement.style.position = 'absolute';
  chartElement.style.left = '0';
  chartElement.style.zIndex = '999';
  chartElement.style.display = 'none';
  chartElement.style.width = '400px';
  chartElement.style.top = '0px';

  return chartElement;
}

function createPortfolioSVG(parent) {
  parent.setAttribute('href', '/portfolio');
  parent.setAttribute('aria-label', 'Portfolio');
  parent.setAttribute('data-testid', 'Portfolio Tab');

  const spanElement = parent.querySelector('span');
  if (spanElement) {
    spanElement.textContent = 'Portfolio';
  }
  const pathElement = parent.querySelector('path');
  pathElement.setAttribute(
    'd',
    'M19.732 7.203v-2.666h-7.464v2.666h-9.063v20.259h25.59v-20.259h-9.063zM13.334 5.604h5.331v1.599h-5.331v-1.599zM12.268 8.27h15.461v8.53h-7.997v-2.133h-7.464v2.133h-7.997v-8.53h7.997zM18.666 15.733v3.199h-5.331v-3.199h5.331zM4.271 26.396v-8.53h7.997v2.133h7.464v-2.133h7.997v8.53h-23.457z'
  );
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
