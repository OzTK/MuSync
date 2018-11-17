function parseQuery(query) {
  return query.split('&').reduce((params, p) => {
    const pair = p.split('=');
    params[pair[0]] = pair[1];
    return params;
  }, {})
}

function retrieveTokens() {
  try {
    const json = localStorage.getItem('tokens') || '{}';
    return JSON.parse(json);
  } catch(e) {
    return {};
  }
}

function saveToken(service, tokenData) {
  const tokens = retrieveTokens();

  if (tokenData) {
    tokens[service] = tokenData;
  } else if (tokens[service]) {
    delete tokens[service];
  }

  localStorage.setItem('tokens', JSON.stringify(tokens));
  return tokens;
}

function collectUrlToken() {
  if (!window.location.search) {
    return retrieveTokens();
  }

  // Get service name
  const query = window.location.search.slice(1);
  const queryParams = parseQuery(query);

  if (!queryParams.service || !window.location.hash) {
    return retrieveTokens();
  }

  const hash = window.location.hash.slice(1);
  const hashParams = parseQuery(hash);

  if (!hashParams.access_token) {
    return retrieveTokens();
  }

  history.replaceState("", document.title, window.location.pathname);
  return saveToken(queryParams.service, hashParams);
}

var tokens = collectUrlToken();
var rawTokens = Object.keys(tokens).map((k) => [k, tokens[k].access_token]);
