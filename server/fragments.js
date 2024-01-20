const DEFINED_APIKEY = 'KENXOgeSDb5dYmS1qlFi67JTW6MMPOqE5jfa6nv5';

const num = (val) => Number(val) || 1;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch('https://graph.defined.fi/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: DEFINED_APIKEY,
    },
  });

  return await result.json();
}

const searchTokensOperation = `
    query MyQuery($name: String!) {
      searchTokens(search: $name, limit: 1, networkFilter: [137], lowVolumeFilter:true) {
        tokens {
          address
          networkId
          name
          decimals
          symbol
          imageThumbUrl
          price
          priceChange
          topPairId
          volume
        }
      }
    }
  `;
const fetchTokenSocialsOperation = `
    query MyQuery($address: String!, $networkId: Int!) {
      token(input: {address: $address, networkId: $networkId}) {
        symbol
        socialLinks {
        twitter
        }
      }
    }
  `;
const fetchTokenChartOperation = `
query MyQuery($id:String!, $from:Int!, $to:Int! ) {
  getBars(
    symbol: $id
    from: $from
    to: $to
    resolution: "1D"
  ) {
    o
    h
    l
    c
    t
  }
}
`;
const fetchTokenSparklinesOperation = `
query MyQuery($id: String!) {
  tokenSparklines(input: {ids: [$id]}) {
    sparkline {
      timestamp
      value
    }
  }
}`;

async function searchToken(name) {
  const { errors, data } = await fetchGraphQL(
    searchTokensOperation,
    'MyQuery',
    { name: name }
  );
  if (errors) {
    console.error(errors);
    return null;
  }
  return data.searchTokens.tokens[0];
}

async function fetchTokenSocials(address, networkId) {
  const { errors, data } = await fetchGraphQL(
    fetchTokenSocialsOperation,
    'MyQuery',
    { address: address, networkId: num(networkId) }
  );
  if (errors) {
    console.error(errors);
    return null;
  }
  return data.token;
}

async function getChart(address, networkId) {
  const id = `${address}:${networkId}`;
  const to = Math.floor(new Date().getTime() / 1000);
  const { errors, data } = await fetchGraphQL(
    fetchTokenChartOperation,
    'MyQuery',
    { id: id, from: to - 4838400, to: to }
  );
  if (errors) {
    console.error(errors);
    return null;
  }
  const bars = [];
  const { o, h, l, c, t } = data.getBars;
  for (let i = 0; i < o.length; i++) {
    if (o[i] === null) {
      continue;
    }
    let _time = new Date(t[i] * 1000).toISOString().split('T')[0];
    bars.push({
      time: _time,
      open: o[i],
      high: h[i],
      low: l[i],
      close: c[i],
    });
  }
  return bars;
}

async function getSparklines(address, networkId) {
  const id = `${address}:${networkId}`;
  const { errors, data } = await fetchGraphQL(
    fetchTokenSparklinesOperation,
    'MyQuery',
    { id: id }
  );
  if (errors) {
    console.error(errors);
    return null;
  }
  const sparklines = data.tokenSparklines[0].sparkline.map((line) => ({
    time: line.timestamp,
    value: line.value,
  }));
  return sparklines;
}

module.exports = {
  searchToken,
  fetchTokenSocials,
  getChart,
  num,
  getSparklines,
};
