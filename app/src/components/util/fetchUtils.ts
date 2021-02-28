// source: https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/blob/master/src/frontend/src/util/fetchUtils.ts

export function fetchTimeOut(
  url: RequestInfo,
  parms: RequestInit | undefined,
  timeout: number
) {
  const abort = new AbortController();
  parms = { ...parms, signal: abort.signal };

  const timer = setTimeout(() => abort.abort(), timeout);

  return fetch(url, parms).finally(() => clearTimeout(timer));
}
