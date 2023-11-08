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

export { createLink, createImage, createSpan, createDiv };
