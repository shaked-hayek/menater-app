import { store } from 'store/store';

export function waitForArcgisAuth(timeoutMs = 10000, intervalMs = 100): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const checkAuth = () => {
      const state = store.getState();
      const authStatus = state.appState.arcgisAuth;

      if (authStatus !== null) {
        clearInterval(interval);
        resolve(authStatus); // resolves true or false
      }

      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Timeout while waiting for ArcGIS auth'));
      }
    };

    const interval = setInterval(checkAuth, intervalMs);
    checkAuth(); // check immediately
  });
}
