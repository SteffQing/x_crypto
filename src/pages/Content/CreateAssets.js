export const ArrowButton = (onClick) => {
  const arrowButton = document.createElement('svg');
  arrowButton.classList.add('svgSize');
  arrowButton.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  arrowButton.setAttribute('fill', 'none');
  arrowButton.setAttribute('viewBox', '0 0 24 24');
  arrowButton.setAttribute('strokeWidth', '1.5');
  arrowButton.setAttribute('stroke', 'currentColor');
  arrowButton.addEventListener('click', onClick);
  const path = document.createElement('path');
  path.setAttribute('strokeLinecap', 'round');
  path.setAttribute('strokeLinejoin', 'round');
  path.setAttribute('d', 'M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75');
  arrowButton.appendChild(path);
  return arrowButton;
};

export const closeButton = () => {
  const closeButton = document.createElement('span');
  closeButton.textContent = '✖️';
  closeButton.classList.add('pointer');
  closeButton.addEventListener('click', () =>
    document.querySelector('.modalWrapper').remove()
  );
  return closeButton;
};
