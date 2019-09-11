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

type Props = {
  handleProceduresModal: () => void,
};

const ProceduresModal = ({ handleProceduresModal }: Props) => {
  const isOpen = useSelector(({ procedures }) => procedures.active);
  const dispatch = useDispatch();

  function onRequestClose() {
    dispatch(deactiveProcedures({}));
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <Blocks handleProceduresModal={handleProceduresModal} />
    </Modal>
  );
};

export default ProceduresModal;
