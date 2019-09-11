/* eslint-disable no-redeclare */
// @flow
import ScratchBlocks from 'scratch-blocks';

import javascript from '../../generators/javascript';
import javascriptEvents from '../../generators/javascript/events';
import javascriptControl from '../../generators/javascript/control';

javascript(ScratchBlocks);
javascriptEvents(ScratchBlocks);
javascriptControl(ScratchBlocks);

/**
 * Set whether the block is highlighted or not.  Block highlighting is
 * often used to visually mark blocks currently being executed.
 * @param {boolean} highlighted True if highlighted.
 */
ScratchBlocks.BlockSvg.prototype.setHighlighted = function(highlighted) {
  if (!this.rendered) {
    return;
  }
  if (highlighted) {
    this.svgPath_.setAttribute(
      'filter',
      'url(#' + this.workspace.options.stackGlowFilterId + ')',
    );
  } else {
    ScratchBlocks.utils.removeAttribute(this.svgPath_, 'filter');
  }
};

export default ScratchBlocks;
