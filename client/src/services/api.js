import axios from "axios";

const API_URL = import.meta.env.API_URL;

export function api(url, body = null, method, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      url: `${API_URL}${url}`,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      data: body,
    };

    axios(options)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
