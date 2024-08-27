// public/admin/admin.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from '../../src/AdminPage';
import LoginPage from '../../src/LoginPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
