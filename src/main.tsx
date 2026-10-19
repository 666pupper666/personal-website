import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfirmProvider } from './context/ConfirmContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { ToastProvider } from './context/ToastContext';
import './styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('找不到根节点 #root');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <SiteDataProvider>
            <App />
          </SiteDataProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
