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
      searchTokens(search: $name, limit: 1) {
        tokens {
          address
          networkId
          name
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

async function searchToken(name) {
  const { errors, data } = await fetchGraphQL(
    searchTokensOperation,
    'MyQuery',
    { name: name }
  );
  if (errors) {
    // handle those errors like a pro
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
    // handle those errors like a pro
    console.error(errors);
    return null;
  }
  return data.token;
}

module.exports = { searchToken, fetchTokenSocials, num };
