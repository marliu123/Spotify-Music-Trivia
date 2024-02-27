import { toPairs } from "lodash";
import "whatwg-fetch";

const SPOTIFY_ROOT = "https://api.spotify.com/v1";

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = (response: any) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

const checkStatus = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error: any = new Error(response.statusText);
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export const request = (url: any, options?: any) => {
  // eslint-disable-next-line no-undef
  return fetch(url, options).then(checkStatus).then(parseJSON);
};
const client_id = "670e27a331c8408c80dce3b14dac6fb9";
const client_secret = "c943a4e7c4dc42f4b99f11e11cb42029";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const fetchFromSpotify = async ({ endpoint, params }: any) => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Failed to obtain access token.");
  }

  let url = `${SPOTIFY_ROOT}/${endpoint}`;
  if (params) {
    const paramString = toPairs(params)
      .map((param: any) => param.join("="))
      .join("&");
    url += `?${paramString}`;
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Spotify API: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

const getAccessToken = async () => {
  const credentials = btoa(`${client_id}:${client_secret}`);
  const body = new URLSearchParams({ grant_type: "client_credentials" });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to obtain access token: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.access_token;
};

export default fetchFromSpotify;
