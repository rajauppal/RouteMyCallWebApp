import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux'
import store from './slices/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="https://dev-fcyph8rq.us.auth0.com"
      clientId="I2OcUe9AltA34cKrshnETdk5MFTNxgmS"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "Epilinq IVR API",
        scope: "openid profile email read:messages manage:numbers"
      }}
    >
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App></App>
        </LocalizationProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
