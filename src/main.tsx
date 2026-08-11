import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { client } from './api/generated/client.gen';
import { BrowserRouter } from 'react-router-dom';

client.setConfig({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
