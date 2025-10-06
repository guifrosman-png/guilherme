import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ClientePublico } from './pages/ClientePublico';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal - Dashboard da profissional */}
        <Route path="/" element={<App />} />

        {/* Rota pública - Cliente responde anamnese */}
        <Route path="/cliente/:linkId" element={<ClientePublico />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
