/* eslint-disable no-redeclare */
// @flow
import ScratchBlocks from 'scratch-blocks';

import javascript from '../../generators/javascript';
import javascriptEvents from '../../generators/javascript/events';
import javascriptControl from '../../generators/javascript/control';

javascript(ScratchBlocks);
javascriptEvents(ScratchBlocks);
javascriptControl(ScratchBlocks);

// /**
//  * Create the SVG image.
//  * @param {!Element} container Containing element.
//  * @param {!ScratchBlocks.Options} options Dictionary of options.
//  * @return {!Element} Newly created SVG image.
//  * @private
//  */
// ScratchBlocks.createDom_ = function(container, options) {
//   // Sadly browsers (Chrome vs Firefox) are currently inconsistent in laying
//   // out content in RTL mode.  Therefore ScratchBlocks forces the use of LTR,
//   // then manually positions content in RTL as needed.
//   container.setAttribute('dir', 'LTR');
//   // Closure can be trusted to create HTML widgets with the proper direction.
//   // goog.ui.Component.setDefaultRightToLeft(options.RTL);

//   // Load CSS.
//   ScratchBlocks.Css.inject(options.hasCss, options.pathToMedia);

//   // Build the SVG DOM.
//   /*
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     xmlns:html="http://www.w3.org/1999/xhtml"
//     xmlns:xlink="http://www.w3.org/1999/xlink"
//     version="1.1"
//     class="ScratchBlocksSvg">
//     ...
//   </svg>
//   */
//   var svg = ScratchBlocks.utils.createSvgElement(
//     'svg',
//     {
//       xmlns: 'http://www.w3.org/2000/svg',
//       'xmlns:html': 'http://www.w3.org/1999/xhtml',
//       'xmlns:xlink': 'http://www.w3.org/1999/xlink',
//       version: '1.1',
//       class: 'ScratchBlocksSvg',
//     },
//     container,
//   );
//   /*
//   <defs>
//     ... filters go here ...
//   </defs>
//   */
//   var defs = ScratchBlocks.utils.createSvgElement('defs', {}, svg);
//   // Each filter/pattern needs a unique ID for the case of multiple ScratchBlocks
//   // instances on a page.  Browser behaviour becomes undefined otherwise.
//   // https://neil.fraser.name/news/2015/11/01/
//   // TODO (tmickel): Look into whether block highlighting still works.
//   // Reference commit:
//   // https://github.com/google/ScratchBlocks/commit/144be4d49f36fdba260a26edbd170ae75bbc37a6
//   var rnd = String(Math.random()).substring(2);

//   // Using a dilate distorts the block shape.
//   // Instead use a gaussian blur, and then set all alpha to 1 with a transfer.
//   var stackGlowFilter = ScratchBlocks.utils.createSvgElement(
//     'filter',
//     {
//       id: 'ScratchBlocksStackGlowFilter' + rnd,
//       height: '160%',
//       width: '180%',
//       y: '-30%',
//       x: '-40%',
//     },
//     defs,
//   );
//   options.stackGlowBlur = ScratchBlocks.utils.createSvgElement(
//     'feGaussianBlur',
//     {
//       in: 'SourceGraphic',
//       stdDeviation: ScratchBlocks.Colours.stackGlowSize,
//     },
//     stackGlowFilter,
//   );
//   // Set all gaussian blur pixels to 1 opacity before applying flood
//   var componentTransfer = ScratchBlocks.utils.createSvgElement(
//     'feComponentTransfer',
//     { result: 'outBlur' },
//     stackGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feFuncA',
//     {
//       type: 'table',
//       tableValues: '0' + repeat(' 1', 16),
//     },
//     componentTransfer,
//   );
//   // Color the highlight
//   ScratchBlocks.utils.createSvgElement(
//     'feFlood',
//     {
//       'flood-color': ScratchBlocks.Colours.stackGlow,
//       'flood-opacity': ScratchBlocks.Colours.stackGlowOpacity,
//       result: 'outColor',
//     },
//     stackGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feComposite',
//     {
//       in: 'outColor',
//       in2: 'outBlur',
//       operator: 'in',
//       result: 'outGlow',
//     },
//     stackGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feComposite',
//     {
//       in: 'SourceGraphic',
//       in2: 'outGlow',
//       operator: 'over',
//     },
//     stackGlowFilter,
//   );

//   // Filter for replacement marker
//   var replacementGlowFilter = ScratchBlocks.utils.createSvgElement(
//     'filter',
//     {
//       id: 'ScratchBlocksReplacementGlowFilter' + rnd,
//       height: '160%',
//       width: '180%',
//       y: '-30%',
//       x: '-40%',
//     },
//     defs,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feGaussianBlur',
//     {
//       in: 'SourceGraphic',
//       stdDeviation: ScratchBlocks.Colours.replacementGlowSize,
//     },
//     replacementGlowFilter,
//   );
//   // Set all gaussian blur pixels to 1 opacity before applying flood
//   var componentTransfer = ScratchBlocks.utils.createSvgElement(
//     'feComponentTransfer',
//     { result: 'outBlur' },
//     replacementGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feFuncA',
//     {
//       type: 'table',
//       tableValues: '0' + repeat(' 1', 16),
//     },
//     componentTransfer,
//   );
//   // Color the highlight
//   ScratchBlocks.utils.createSvgElement(
//     'feFlood',
//     {
//       'flood-color': ScratchBlocks.Colours.replacementGlow,
//       'flood-opacity': ScratchBlocks.Colours.replacementGlowOpacity,
//       result: 'outColor',
//     },
//     replacementGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feComposite',
//     {
//       in: 'outColor',
//       in2: 'outBlur',
//       operator: 'in',
//       result: 'outGlow',
//     },
//     replacementGlowFilter,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feComposite',
//     {
//       in: 'SourceGraphic',
//       in2: 'outGlow',
//       operator: 'over',
//     },
//     replacementGlowFilter,
//   );
//   /*
//     <pattern id="ScratchBlocksDisabledPattern837493" patternUnits="userSpaceOnUse"
//              width="10" height="10">
//       <rect width="10" height="10" fill="#aaa" />
//       <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#cc0" />
//     </pattern>
//   */
//   var embossFilter = ScratchBlocks.utils.createSvgElement(
//     'filter',
//     { id: 'blocklyEmbossFilter' + rnd },
//     defs,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'feComposite',
//     {
//       in: 'SourceGraphic',
//       //'in2': 'specOut',
//       operator: 'arithmetic',
//       k1: 0,
//       k2: 1,
//       k3: 1,
//       k4: 0,
//     },
//     embossFilter,
//   );

//   // Filter for highlighting
//   var highlightGlowFilter = ScratchBlocks.utils.createSvgElement(
//     'filter',
//     {
//       id: 'blocklyHighlightGlowFilter' + rnd,
//       height: '160%',
//       width: '180%',
//       y: '-30%',
//       x: '-40%',
//     },
//     defs,
//   );
//   options.highlightGlowBlur = ScratchBlocks.utils.createSvgElement(
//     'feGaussianBlur',
//     {
//       in: 'SourceGraphic',
//       stdDeviation: 1.1,
//     },
//     highlightGlowFilter,
//   );

//   var disabledPattern = ScratchBlocks.utils.createSvgElement(
//     'pattern',
//     {
//       id: 'blocklyDisabledPattern' + rnd,
//       patternUnits: 'userSpaceOnUse',
//       width: 10,
//       height: 10,
//     },
//     defs,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'rect',
//     { width: 10, height: 10, fill: '#aaa' },
//     disabledPattern,
//   );
//   ScratchBlocks.utils.createSvgElement(
//     'path',
//     { d: 'M 0 0 L 10 10 M 10 0 L 0 10', stroke: '#cc0' },
//     disabledPattern,
//   );
//   options.stackGlowFilterId = stackGlowFilter.id;
//   options.replacementGlowFilterId = replacementGlowFilter.id;
//   options.disabledPatternId = disabledPattern.id;
//   options.embossFilterId = embossFilter.id;
//   options.highlightGlowFilterId = highlightGlowFilter.id;

//   options.gridPattern = ScratchBlocks.Grid.createDom(
//     rnd,
//     options.gridOptions,
//     defs,
//   );
//   return svg;
// };

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
