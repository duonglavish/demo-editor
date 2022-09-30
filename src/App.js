import * as React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import { EditorPage } from './Modify/';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
