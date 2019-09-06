// @flow
import React, { useEffect, createRef, useRef } from 'react';
import { useSelector } from 'react-redux';

import ScratchBlocks from '../../../lib/koov-scratch-blocks';

const Blocks = () => {
  const blocksRef = createRef();
  const workspace: ScratchBlocks = useRef();
  const mutationRoot: ScratchBlocks = useRef();

  const { mutator } = useSelector(({ procedures }) => procedures);

  useEffect(() => {
    if (!blocksRef.current) return;
    // @todo This is a hack to make there be no toolbox.
    const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
    ScratchBlocks.Blocks.defaultToolbox = null;
    workspace.current = ScratchBlocks.inject(blocksRef.current, {
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

    mutationRoot.current = workspace.current.newBlock('procedures_declaration');
    // Make the declaration immovable, undeletable and have no context menu
    mutationRoot.current.setMovable(false);
    mutationRoot.current.setDeletable(false);
    mutationRoot.current.contextMenu = false;

    workspace.current.addChangeListener(() => {
      mutationRoot.current.onChangeFn();
      // Keep the block centered on the workspace
      const metrics = workspace.current.getMetrics();
      const { x, y } = mutationRoot.current.getRelativeToSurfaceXY();
      const dy = metrics.viewHeight / 2 - mutationRoot.current.height / 2 - y;
      let dx = metrics.viewWidth / 2 - mutationRoot.current.width / 2 - x;
      // If the procedure declaration is wider than the view width,
      // keep the right-hand side of the procedure in view.
      if (mutationRoot.current.width > metrics.viewWidth) {
        dx = metrics.viewWidth - mutationRoot.current.width - x;
      }
      mutationRoot.current.moveBy(dx, dy);
    });

    mutationRoot.current.domToMutation(mutator);
    mutationRoot.current.initSvg();
    mutationRoot.current.render();
    // setWrap({ warp: mutationRoot.current.getWarp() });
    // Allow the initial events to run to position this block, then focus.
    setTimeout(() => {
      mutationRoot.current.focusLastEditor_();
    });

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    };
  }, [blocksRef, mutator]);

  return <div ref={blocksRef} style={{ width: 700, height: 200 }} />;
};

export default Blocks;
