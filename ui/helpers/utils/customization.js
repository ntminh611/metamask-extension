export function inputValue(element, value ) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  nativeInputValueSetter.call(element, value);
  const event = new Event('input', { bubbles: true });
  element.dispatchEvent(event);
}

export function parseQueryString(queryString) {
  const search = queryString.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}

export const prefixChainId = (chainId) => {
  let prefixedChainId = chainId;
  if (!chainId.startsWith('0x')) {
    prefixedChainId = `0x${parseInt(chainId, 10).toString(16)}`;
  }
  return prefixedChainId;
};

export const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
