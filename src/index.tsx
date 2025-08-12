import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ThemeProvider from "react-bootstrap/ThemeProvider";

import App from './App';
import './services/i18n.service';
import { errorHandler } from 'actions/errors/errorHandler';
import { store } from 'store/store';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// treat unhandled errors
// see https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
// https://stackoverflow.com/questions/64318300/react-global-error-handler-not-working-for-async-componentdidmount-tried-both-c/64319415#64319415
window.addEventListener('error', function (event) {
    console.error("Error from window.addEventListener: " + event);
    errorHandler(store.dispatch, event.message);
});

window.onunhandledrejection = (e: PromiseRejectionEvent) => {
    console.error("Error from window.onunhandledrejection: " + e);
    errorHandler(store.dispatch, e.reason.stack);
};
