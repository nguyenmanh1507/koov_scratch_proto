// @flow
import React, { Component } from 'react';
import ScratchBlocks from '../../../lib/koov-scratch-blocks/KoovScratchBlocks';

type Props = { ws: ScratchBlocks.workspace };

class Blocks extends Component<Props> {
  blocksRef: ?HTMLDivElement;
  workspace: ScratchBlocks.Workspace;

  componentDidMount() {
    const { ws } = this.props;

    const dom = ScratchBlocks.Xml.workspaceToDom(ws);
    const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
    ScratchBlocks.Blocks.defaultToolbox = null;
    this.workspace = ScratchBlocks.inject(this.blocksRef, {
      media: '../../media/',
      scrollbars: true,
      zoom: {
        controls: false,
        wheel: false,
        startScale: 0.7,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      grid: { spacing: 30, length: 3, colour: '#ccc', snap: true },
    });
    ScratchBlocks.Blocks.defaultToolbox = oldDefaultToolbox;

    this.workspace.clear();
    ScratchBlocks.Xml.domToWorkspace(dom, this.workspace);
  }

  componentWillUnmount() {
    if (this.workspace) {
      this.workspace.dispose();
    }
  }

  render() {
    return (
      <div
        style={{ width: 1100, height: 600 }}
        ref={ref => {
          this.blocksRef = ref;
        }}
      ></div>
    );
  }
}

export default Blocks;
