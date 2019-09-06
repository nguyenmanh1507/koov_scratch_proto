// @flow
import React from 'react';
import Modal from 'react-modal';

import './App.css';
import KoovBlocks from './components/KoovBlocks';
import ProceduresModal from './components/Modals/ProceduresModal';

Modal.setAppElement('#root');

function App() {

  return (
    <>
      <KoovBlocks></KoovBlocks>
      <ProceduresModal  />
      </>
  );
}

export default App;
