import axios from "axios";

export const apiConnector = async (method, url, data = null, headers = {}) => {
  const response = await axios({
    method: method,
    url: url,
    data: data,
    headers: headers,
  });
  return response;
};
