// @flow
import React, { useEffect, createRef, useRef } from 'react';
import ScratchBlocks from 'scratch-blocks';

import javascript from '../../generators/javascript';
import javascriptEvents from '../../generators/javascript/events';
import javascriptControl from '../../generators/javascript/control';

javascript(ScratchBlocks);
javascriptEvents(ScratchBlocks);
javascriptControl(ScratchBlocks);

function KoovBlocks() {
  const blocklyRef = createRef();
  const workspace = useRef();
  const project = useRef();

  useEffect(() => {
    workspace.current = ScratchBlocks.inject(blocklyRef.current, {
      toolbox,
      media: '../../media/',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.7,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      grid: { spacing: 30, length: 3, colour: '#ccc', snap: true },
      trashcan: true,
    });

    workspace.current.scrollbar.set(0, 0);

    // For debugger only
    window.ws = workspace.current;
    window.ScratchBlocks = ScratchBlocks;
  }, [blocklyRef]);

  function logWSXml() {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(workspace.current);
    const domText = ScratchBlocks.Xml.domToText(wsDom);
    console.log(wsDom);
    console.log(domText);
  }

  function saveWorkspace() {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(workspace.current);
    project.current = ScratchBlocks.Xml.domToText(wsDom);

    window.localStorage.setItem('@@ws', project.current);
  }

  function loadWorkspace() {
    const domText = window.localStorage.getItem('@@ws');
    const dom = ScratchBlocks.Xml.textToDom(domText);
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, workspace.current);
  }

  function genJSCode() {
    const code = ScratchBlocks.JavaScript.workspaceToCode(workspace.current);
    console.log(code);
  }

  function highlightBlock() {
    ScratchBlocks.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    ScratchBlocks.JavaScript.addReservedWords('highlightBlock');
    if (workspace.current) {
      // workspace.current.highlightBlock('control_wait', true);
      console.log(workspace.current.getBlockById('xg73mSK5$6ic82?iWWde'))
    }
  }

  return (
    <>
      <div ref={blocklyRef} style={{ height: '100vh', width: '100%' }}></div>
      <button
        onClick={logWSXml}
        style={{ position: 'absolute', right: 10, top: 10 }}
      >
        Log Workspace XML
      </button>
      <button
        onClick={saveWorkspace}
        style={{ position: 'absolute', right: 10, top: 40 }}
      >
        Save Workspace
      </button>
      <button
        onClick={loadWorkspace}
        style={{ position: 'absolute', right: 10, top: 70 }}
      >
        Load Workspace
      </button>
      <button
        onClick={genJSCode}
        style={{ position: 'absolute', right: 10, top: 100 }}
      >
        Generate JS code
      </button>
      <button
        onClick={highlightBlock}
        style={{ position: 'absolute', right: 10, top: 130 }}
      >
        Highlight Block
      </button>
    </>
  );
}

export default KoovBlocks;

const toolbox = `
<xml id="toolbox" style="display: none">
  <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
    <block type="event_whenflagclicked"/>
    <block type="event_whenkeypressed"/>
  </category>
  <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#2cc3ea" secondaryColour="#2cc3ea">
    <block type="control_wait">
      <value name="DURATION">
        <shadow type="math_positive_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>
    <block type="control_if"/>
    <block type="control_if_else"/>
    <block id="wait_until" type="control_wait_until"/>
    <block id="repeat_until" type="control_repeat_until"/>
  </category>
</xml>
`;
