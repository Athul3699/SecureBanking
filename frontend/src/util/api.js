export async function postRequest(url = '', data = {}) {
    data["token"] = window.localStorage.getItem('API_TOKEN')
    const response = await fetch(url, {
      method: 'POST',
    //   mode: 'no-cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
}