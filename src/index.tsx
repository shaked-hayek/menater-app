import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ThemeProvider from "react-bootstrap/ThemeProvider";

import App from './App';
import './services/i18n.service';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider dir="rtl">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// treat unhandled errors
// see https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
// https://stackoverflow.com/questions/64318300/react-global-error-handler-not-working-for-async-componentdidmount-tried-both-c/64319415#64319415
window.addEventListener('error', function (event) {
  console.error(event);
  // add logs server - 796
});

window.onunhandledrejection = (e: PromiseRejectionEvent) => {
  console.error(e);
  throw new Error(e.reason.stack);
};
