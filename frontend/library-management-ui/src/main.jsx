import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store/store';
import AppThemeProvider from './components/layout/AppThemeProvider';
import GlobalSnackbar from './components/common/GlobalSnackbar';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppThemeProvider>
          <App />
          <GlobalSnackbar />
        </AppThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
