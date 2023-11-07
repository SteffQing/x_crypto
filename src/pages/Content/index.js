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

    // If an error occurred, wait for 5 seconds and then try again
    setTimeout(() => {
      console.log('Retrying after 5 seconds...');
      addPortfolio();
    }, 5000);
  }
};

const addPortfolio = () => {
  const tab = document.querySelector("[aria-label='Primary']");
  const portfolio = createLink('/portfolio');
  const firstChild = tab.firstChild;
  portfolio.classList = firstChild.classList;
  const portfolioDiv1 = document.createElement('div');
  portfolioDiv1.classList = firstChild.firstChild.classList;
  const portfolioDiv2 = document.createElement('div');
  portfolioDiv2.classList = firstChild.firstChild.firstChild.classList;
  const portfolioSvg = createPortfolioSVG(
    firstChild.firstChild.firstChild.firstChild.classList
  );

  //
  portfolio.ariaLabel = 'View your Portfolio';
  portfolio.role = 'Portfolio';
  portfolio.dataset.testid = 'Portfolio Tab';

  // Append the parts to the container
  portfolioDiv2.appendChild(portfolioSvg);
  portfolioDiv1.appendChild(portfolioDiv2);
  portfolio.appendChild(portfolioDiv1);

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
    attachInfoTag();
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
      const checkLastTag = selectedTweetTag.querySelector(`.${CLASS_FOR_TAG}`);
      if (matchedTag) {
        if (checkLastTag) {
          checkLastTag.remove();
        }
        const newDiv = createInfo(matchedTag);
        const firstChild = selectedTweetTag.firstChild;
        selectedTweetTag.insertBefore(newDiv, firstChild);
        cashtag_span.addEventListener('mouseover', () => {
          console.log('Event listener fired');
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
  const priceNode = createSpan(`${price}`, 'PRICE');
  const priceChangeNode = createSpan(`📈 ${num(priceChange).toFixed(2)}%`);
  const volumeNode = createSpan(`💹 $${formatVolume(volume)}`);

  // Chart and Buy/Sell
  const chartNode = createChartNode(bar);
  const viewChartNode = createSpan('📊 Chart', 'CHART', chartNode);
  const viewBuySellModal = createSpan('💱 Trade', 'Trade');

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

function createSpan(text, type = false, elem = null) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'nowrap';
  if (type === 'PRICE') {
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
  } else {
    span.textContent = text;
    if (type === 'CHART') {
      span.addEventListener('mouseover', () => {
        elem.style.display = 'block';
      });
      span.addEventListener('mouseout', () => {
        setTimeout(() => {
          elem.style.display = 'none';
        }, 5000);
      });
    }
  }
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
  chartElement.style.top = '0';
  chartElement.style.right = '0';
  chartElement.style.width = '100%';
  chartElement.style.zIndex = '999';
  chartElement.style.display = 'none';

  return chartElement;
}

function createPortfolioSVG(classList) {
  const svgElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  svgElement.ariaHidden = 'true';
  svgElement.setAttribute('viewBox', '0 0 512 512');
  svgElement.setAttribute('fill', '#000000');
  svgElement.setAttribute('height', '24px');
  svgElement.setAttribute('width', '24px');
  svgElement.classList = classList;

  // Title element
  const gElement = document.createElement('g');
  const gElement2 = document.createElement('g');

  // Path element
  const pathElement = document.createElement('path');
  pathElement.setAttribute(
    'd',
    'M469.779,94.063H352.573l-9.106-36.426c-4.709-18.832-21.554-31.983-40.962-31.983h-93.011 c-19.408,0-36.253,13.152-40.963,31.984l-9.105,36.425H42.221C18.941,94.063,0,113.003,0,136.284v307.841 c0,23.281,18.941,42.221,42.221,42.221h427.557c23.281,0,42.221-18.941,42.221-42.221V136.284	C512,113.003,493.059,94.063,469.779,94.063z M184.086,61.528c2.922-11.682,13.371-19.841,25.409-19.841h93.011 c12.038,0,22.486,8.159,25.409,19.84l8.133,32.536h-18.732l-7.033-28.132c-0.891-3.569-4.098-6.072-7.777-6.072h-93.011	c-3.678,0-6.885,2.503-7.777,6.072l-7.031,28.132h-18.732L184.086,61.528z M300.789,94.063h-89.578l4.543-18.171h80.492	L300.789,94.063z M42.221,110.096h427.557c8.005,0,15.177,3.614,19.985,9.291l-52.05,156.149	c-4.736,14.208-17.98,23.754-32.957,23.754H289.67v-17.637c0-9.136-7.432-16.568-16.568-16.568h-34.205	c-9.136,0-16.568,7.432-16.568,16.568v17.637H107.243c-14.976,0-28.221-9.546-32.957-23.753l-52.05-156.15 C27.044,113.71,34.216,110.096,42.221,110.096z M238.363,316.393v-34.739c0-0.295,0.239-0.534,0.534-0.534h34.205 c0.295,0,0.534,0.239,0.534,0.534v34.739H238.363z M273.637,332.426v17.637c0,0.295-0.239,0.534-0.534,0.534h-34.205	c-0.295,0-0.534-0.239-0.534-0.534v-17.637H273.637z M495.967,444.125c0,14.44-11.748,26.188-26.188,26.188H42.221 c-14.44,0-26.188-11.748-26.188-26.188V151.481l43.042,129.126c6.922,20.765,26.279,34.717,48.168,34.717H222.33v34.739 c0,9.136,7.432,16.568,16.568,16.568h34.205c9.136,0,16.568-7.432,16.568-16.568v-34.739h115.087 c21.889,0,41.245-13.951,48.168-34.717l43.042-129.126V444.125z'
  );

  // Append the title and path elements to the SVG
  gElement.appendChild(pathElement);
  gElement2.appendChild(gElement);
  svgElement.appendChild(gElement2);
  return svgElement;
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
