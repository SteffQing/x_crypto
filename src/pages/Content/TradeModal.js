import { closeButton } from './CreateAssets';

export function TradeModal(title = 'Transaction in progress', subtitle = '') {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modalWrapper');
  modalWrapper.innerHTML = '';
  const modal = document.createElement('div');
  modal.classList.add('modal');

  let img = document.createElement('img');
  img.src = 'https://thumbs4.imagebam.com/72/f0/1a/MESML3F_t.png';
  img.alt = 'loading';
  img.style.width = '40px';
  img.style.height = '40px';

  modal.appendChild(img);
  modal.appendChild(ModalContent(title, subtitle));
  modalWrapper.appendChild(modal);

  return modalWrapper;
}

function ModalContent(title, subtitle) {
  const modalContent = document.createElement('div');
  modalContent.classList.add('modalContent');
  modalContent.appendChild(ModalHeader(title, false));
  if (subtitle) modalContent.appendChild(ModalSubtitle(subtitle));
  return modalContent;
}
export function ModalHeader(titleContent = 'Swap', add_button = true) {
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modalHeader');
  const title = document.createElement('h1');
  title.textContent = titleContent;
  title.classList.add('text');
  title.style.margin = '0';

  modalHeader.appendChild(title);
  if (add_button) {
    modalHeader.appendChild(closeButton());
  }
  return modalHeader;
}
function ModalSubtitle(subtitleContent) {
  const modalBody = document.createElement('p');
  modalBody.textContent = subtitleContent;
  return modalBody;
}
