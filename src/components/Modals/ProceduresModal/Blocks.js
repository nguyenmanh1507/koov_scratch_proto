// @flow
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';

import ScratchBlocks from '../../../lib/koov-scratch-blocks';

type Props = {
  procedures: Object,
};
class Blocks extends Component<Props> {
  blocksRef: any = createRef();
  workspace: ScratchBlocks = null;
  mutationRoot: ScratchBlocks = null;

  componentDidMount() {
    if (!this.blocksRef.current) return;
    // @todo This is a hack to make there be no toolbox.
    const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
    ScratchBlocks.Blocks.defaultToolbox = null;
    this.workspace = ScratchBlocks.inject(this.blocksRef.current, {
      toolbox: null,
      media: '/media/',
      zoom: {
        controls: false,
        wheel: false,
        startScale: 0.9,
      },
      comments: false,
      collapse: false,
      scrollbars: true,
    });
    ScratchBlocks.Blocks.defaultToolbox = oldDefaultToolbox;

    this.mutationRoot = this.workspace.newBlock('procedures_declaration');
    // Make the declaration immovable, undeletable and have no context menu
    this.mutationRoot.setMovable(false);
    this.mutationRoot.setDeletable(false);
    this.mutationRoot.contextMenu = false;

    this.workspace.addChangeListener(() => {
      this.mutationRoot.onChangeFn();
      // Keep the block centered on the workspace
      const metrics = this.workspace.getMetrics();
      const { x, y } = this.mutationRoot.getRelativeToSurfaceXY();
      const dy = metrics.viewHeight / 2 - this.mutationRoot.height / 2 - y;
      let dx = metrics.viewWidth / 2 - this.mutationRoot.width / 2 - x;
      // If the procedure declaration is wider than the view width,
      // keep the right-hand side of the procedure in view.
      if (this.mutationRoot.width > metrics.viewWidth) {
        dx = metrics.viewWidth - this.mutationRoot.width - x;
      }
      this.mutationRoot.moveBy(dx, dy);
    });

    this.mutationRoot.domToMutation(this.props.procedures.mutator);
    this.mutationRoot.initSvg();
    this.mutationRoot.render();
    // setWrap({ warp: this.mutationRoot.getWarp() });
    // Allow the initial events to run to position this block, then focus.
    setTimeout(() => {
      this.mutationRoot.focusLastEditor_();
    });
  }

  componentWillUnmount() {
    if (this.workspace) {
      this.workspace.dispose();
    }
  }

  render() {
    return <div ref={this.blocksRef} style={{ width: 700, height: 200 }} />;
  }

  // const { mutator } = useSelector(({ procedures }) => procedures);
}

const mapStateToProps = ({ procedures }) => ({ procedures });

export default connect(
  mapStateToProps,
  null,
)(Blocks);
