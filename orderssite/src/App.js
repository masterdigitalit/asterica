import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GetItemsList from './components/home';
import VideoEditor from './components/edit';
import Page from './components/Page';
import Navigation from './components/Navigation';

import styles from './app.module.scss'

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
      <Navigation/>

        <Routes>
          <Route path="/page/:linkId" element={<Page />} />
          <Route path="/" element={<GetItemsList/>} />
          <Route path="*" element={<Page />} />
          <Route path="/edit" element={<VideoEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

