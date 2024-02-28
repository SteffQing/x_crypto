import { stripPrice } from '../../../utils';
const fontColor = '#888';
const emphasizeColor = '#d2d2d2';

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

function createSpan(text, bool = false, type = null) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'nowrap';
  if (bool) {
    const { subscript, value } = stripPrice(text);
    if (!subscript) {
      if (type === 'BALANCE') {
        span.textContent = value;
      } else span.textContent = `$${value}`;
      return span;
    }
    if (Number(subscript) === -1) {
      if (type === 'BALANCE') {
        span.textContent = `0.${value}`;
      } else span.textContent = `$0.${value}`;
      return span;
    }
    if (Number(subscript) === 0) {
      if (type === 'BALANCE') {
        span.textContent = `0.0${value}`;
      } else span.textContent = `$0.0${value}`;
      return span;
    }
    const subscriptNode = document.createElement('sub');
    subscriptNode.textContent = subscript;
    subscriptNode.style.fontSize = '8px';

    const container = document.createElement('span');
    let zeroText = null;
    if (type === 'BALANCE') {
      zeroText = document.createTextNode('0.0');
    } else zeroText = document.createTextNode('$0.0');

    // Append the parts to the container
    container.appendChild(zeroText);
    container.appendChild(subscriptNode);
    container.appendChild(document.createTextNode(value));

    // Append the container to the parent span element
    span.appendChild(container);
  } else span.textContent = text;

  return span;
}

function mergeToDiv(element1, element2, element3 = null) {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.gap = '4px';

  div.appendChild(element1);
  div.appendChild(element2);
  if (element3) {
    div.appendChild(element3);
  }

  return div;
}

function createHeader(text) {
  const h1 = document.createElement('h1');
  h1.classList.add('header_text');
  return h1;
}

function createTable(assets) {
  const headers = ['Asset', 'Balance', 'Price', 'USD Value', 'Chain'];
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const tr1 = document.createElement('tr');
  for (let i = 0; i < 5; i++) {
    const td = document.createElement('th');
    td.textContent = headers[i];
    tr1.appendChild(td);
  }
  thead.appendChild(tr1);
  table.appendChild(thead);
  for (let i = 0; i < assets.length; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement('td');
      const {
        blockchain,
        tokenSymbol,
        balance,
        balanceUsd,
        tokenPrice,
        thumbnail,
      } = assets[i];
      switch (j) {
        case 0:
          const imageNode = createImage(thumbnail, tokenSymbol);
          const symbolNode = createSpan(tokenSymbol);
          const imageSymbolNode = mergeToDiv(imageNode, symbolNode);
          cell.appendChild(imageSymbolNode);
          break;
        case 1:
          const balance_span = createSpan(balance, true, 'BALANCE');
          cell.appendChild(balance_span);
          break;
        case 2:
          const price_span = createSpan(tokenPrice, true);
          cell.appendChild(price_span);
          break;
        case 3:
          const balanceUSD_span = createSpan(balanceUsd, true);
          cell.appendChild(balanceUSD_span);
          break;
        case 4:
          cell.textContent = blockchain;
          break;
        default:
          break;
      }
      tr.appendChild(cell);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
}

export {
  createLink,
  createImage,
  createSpan,
  mergeToDiv,
  createTable,
  createHeader,
};
