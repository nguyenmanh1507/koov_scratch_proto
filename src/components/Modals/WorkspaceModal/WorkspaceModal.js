// @flow
import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import Blocks from './Blocks';
import { closeModal } from '../../../reducers';
import ScratchBlocks from '../../../lib/koov-scratch-blocks/KoovScratchBlocks';

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
  isOpen: boolean,
  onRequestClose: (modalName: string) => void,
  ws: ScratchBlocks.Workspace,
};

class WorkspaceModal extends Component<Props> {
  render() {
    const { isOpen, onRequestClose, ws } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Blocks ws={ws} />
      </Modal>
    );
  }
}

const mapStateToProps = ({ modal }) => ({
  isOpen: modal.modalName === 'workspace-modal',
});

const mapDispatchToProps = dispatch => ({
  onRequestClose: () => {
    dispatch(closeModal());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkspaceModal);
