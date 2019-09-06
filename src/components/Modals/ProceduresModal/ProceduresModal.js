// @flow
import React from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';

import { deactiveProcedures } from '../../../reducers';
import Blocks from './Blocks';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ProceduresModal = () => {
  const isOpen = useSelector(({ procedures }) => procedures.active);
  const dispatch = useDispatch();

  function onRequestClose(mutator) {
    dispatch(deactiveProcedures({ mutator }));
  }

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={onRequestClose}
      style={customStyles}
      // componentRef={setBlocks}
      contentLabel="Example Modal"
    >
      <Blocks />
    </Modal>
  );
};

export default ProceduresModal;
