import axios from "axios";

const API_URL = process.env.API_URL;

export function api(url, method, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      url: `${API_URL}${url}`,
      // headers is causing issues... may need to edit the backend
      // could be due to CORS...

      // headers: {
      //   "Content-Type": "application/json",
      //   ...headers,
      // },
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
