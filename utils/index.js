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
