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

export const closeButton = (onClick) => {
  const closeButton = document.createElement('svg');
  closeButton.classList.add('svgSize');
  closeButton.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  closeButton.setAttribute('fill', 'none');
  closeButton.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElement('path');
  path.setAttribute(
    'd',
    'M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z'
  );
  path.setAttribute('fill', '#0D0D0D');
  closeButton.appendChild(path);

  closeButton.addEventListener('click', onClick);
  return closeButton;
};
