export async function postRequest(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('API_TOKEN')
      },
      body: JSON.stringify(data)
    });

    return await response.json();
}

export async function getRequest(url = '') {

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('API_TOKEN')
    },
  });

  return await response.json();
}

export async function getRequestWithoutToken(url = '') {

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('API_TOKEN')
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function putRequestWithoutToken(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function deleteRequest(url = '', data = {}) {
  data["token"] = window.localStorage.getItem('API_TOKEN')

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('API_TOKEN')
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function deleteRequestWithoutToken(url = '', data = {}) {

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}