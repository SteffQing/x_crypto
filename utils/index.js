export function displayAddressOrENS(address) {
  if (address) {
    if (address.length > 40) {
      let account = address.toUpperCase();
      return `${account.slice(0, 5)}...${account.slice(38, 42)}`;
    } else {
      return address.slice(0, 5) + '...';
    }
  }
  return '';
}

export const cashtag_regex = /cashtag_click/;

export function stripSocials(url) {
  let username = url.replace(
    /(https?:\/\/)?(www\.)?(twitter)\.com\/(#!\/)?/i,
    ''
  );
  return `${username.slice(0, 5)}...`;
}
export function stripPrice(price) {
  if (Math.floor(Number(price)) > 0) {
    return { subscript: null, value: formatVolume(price) };
  }
  // Split on decimal
  const [, decimal] = price.split('.');

  // Remove trailing zeros
  const value = decimal.replace(/0+/g, '');

  // Get substring of just zeros
  const zeros = decimal.slice(0, -value.length);

  // Add subscript with zeros count - 1
  const subscript = zeros.length - 1;

  return { subscript: subscript.toString(), value: value.slice(0, 2) };
}

export function formatVolume(volume) {
  const num = parseFloat(volume);

  if (isNaN(num)) {
    return '0';
  }

  if (num >= 1e9) {
    // Value is in billions
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    // Value is in millions
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    // Value is in thousands
    return (num / 1e3).toFixed() + 'K';
  } else {
    // Value is less than 1,000
    return num.toFixed(2);
  }
}
