// @flow
import React from 'react';
import Modal from 'react-modal';

import './App.css';
import KoovBlocks from './components/KoovBlocks';

Modal.setAppElement('#root');

function App() {
  return (
    <>
      <KoovBlocks></KoovBlocks>
    </>
  );
}

export default App;
