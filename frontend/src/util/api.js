export async function postRequest(url = '', data = {}) {
    data["token"] = window.localStorage.getItem('API_TOKEN')
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
}

export async function getRequest(url = '') {
  // data["token"] = window.localStorage.getItem('API_TOKEN')

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return await response.json();
}

export async function postRequestWithoutToken(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function putRequest(url = '', data = {}) {
  data["token"] = window.localStorage.getItem('API_TOKEN')

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}