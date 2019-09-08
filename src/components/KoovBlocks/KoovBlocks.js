// @flow
import React, { useEffect, createRef, useRef } from 'react';
import {
  useDispatch
  // useSelector
} from 'react-redux';

import ScratchBlocks from '../../lib/koov-scratch-blocks';
import { activeProcedures } from '../../reducers';

function KoovBlocks() {
  const ScratchBlocksRef = createRef();
  const workspace = useRef();
  const headlessWs = useRef();
  const project = useRef();
  const dispatch = useDispatch();
  // const procedures = useSelector(({ procedures }) => procedures);

  useEffect(() => {
    headlessWs.current = new ScratchBlocks.Workspace();
    // console.log(wsHeadless.current);

    workspace.current = ScratchBlocks.inject(ScratchBlocksRef.current, {
      toolbox,
      media: '../../media/',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.7,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      grid: { spacing: 30, length: 3, colour: '#ccc', snap: true },
      trashcan: true
    });

    workspace.current.scrollbar.set(0, 0);

    // Custom procedures
    ScratchBlocks.Procedures.externalProcedureDefCallback = (
      mutator,
      callback
    ) => {
      dispatch(activeProcedures({ mutator, callback }));
    };

    // headlessWs.current.addChangeListener(event => {
    //   if (event.type === ScratchBlocks.Events.UI) {
    //     return; // Don't mirror UI events.
    //   }

    //   const json = event.toJson();
    //   console.log({ json });
    //   const mirrorEvent = ScratchBlocks.Events.fromJson(
    //     json,
    //     workspace.current
    //   );
    //   mirrorEvent.run(true);
    // });

    workspace.current.addChangeListener(event => {
      if (event.type === ScratchBlocks.Events.UI) {
        return; // Don't mirror UI events.
      }

      const json = event.toJson();
      console.log({ json });
      // const mirrorEvent = ScratchBlocks.Events.fromJson(
      //   json,
      //   headlessWs.current
      // );
      // mirrorEvent.run(true);
    });

    // For debugger only
    window.ws = workspace.current;
    window.ScratchBlocks = ScratchBlocks;

    return () => {
      if (headlessWs.current && workspace.current) {
        headlessWs.current.dispose();
        workspace.current.dispose();
      }
    };
  }, [ScratchBlocksRef, dispatch]);

  // useEffect(() => {
  //   window.setTimeout(() => {
  //     if (procedures.active === false) {
  //       console.log('Update toolbox');
  //       workspace.current.refreshToolboxSelection_();
  //       workspace.current.toolbox_.scrollToCategoryById('myBlocks');
  //     }
  //   }, 2000);
  // }, [procedures]);

  function logWSXml() {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(workspace.current);
    const domText = ScratchBlocks.Xml.domToText(wsDom);
    console.log(wsDom);
    console.log(domText);
  }

  function saveWorkspace() {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(headlessWs.current);
    project.current = ScratchBlocks.Xml.domToText(wsDom);

    window.localStorage.setItem('@@ws', project.current);
  }

  function loadWorkspace() {
    const domText = window.localStorage.getItem('@@ws');
    const dom = ScratchBlocks.Xml.textToDom(domText);
    headlessWs.current.clear();
    ScratchBlocks.Xml.domToWorkspace(dom, headlessWs.current);
    // workspace.current.clear();
    // ScratchBlocks.Xml.domToWorkspace(dom, workspace.current);
    // const allBlocks = headlessWs.current.getAllBlocks();
    // const codeBlocks = allBlocks.filter(
    //   block => block.type !== 'procedures_definition'
    // );
    // console.log({ codeBlocks });
    // const a = ScratchBlocks.Xml.textToDom(codeBlocks.join());
    // console.log({ a });
    const domWs = new window.DOMParser();
    const a = domWs.parseFromString(domText, 'text/html');
    const xml = document.createElement('xml');
    xml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    console.log({ a: a.querySelector('xml').children });
    console.log({ a: a.querySelectorAll('block') });
    a.querySelectorAll('block').forEach(a1 => {
      if (a1.getAttribute('type') === 'procedures_definition') {
        xml.innerHTML += a1.outerHTML;
      }
    });

    // const childs = a.querySelector('xml').children;
    // for (let i = 0; i <= childs.length - 1; i++) {
    //   console.log(childs[i].getAttribute('type') !== 'procedures_definition');
    //   if (childs[i].getAttribute('type') !== 'procedures_definition') {
    //     xml.innerHTML += childs[i].outerHTML;
    //   }
    // }

    workspace.current.clear();
    ScratchBlocks.Xml.domToWorkspace(xml, workspace.current);
    console.log(xml);
  }

  function genJSCode() {
    const code = ScratchBlocks.JavaScript.workspaceToCode(workspace.current);
    console.log(code);
  }

  function highlightBlock() {
    ScratchBlocks.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    ScratchBlocks.JavaScript.addReservedWords('highlightBlock');
    if (workspace.current) {
      workspace.current.highlightBlock(')[dIl1~SRuZuq7RtMu3.', true);
    }
  }

  function refreshToolbox() {
    workspace.current.refreshToolboxSelection_();
    workspace.current.toolbox_.scrollToCategoryById('myBlocks');
  }

  function doSomething() {
    // workspace.current.getAllBlocks().forEach(block => {
    //   console.log(block.type);
    //   if (block.type === 'procedures_definition') {
    //     const dom = ScratchBlocks.Xml.blockToDom(block);
    //     block.setDisabled(true);
    //     block.setEditable(false);
    //     // block.setStyle()
    //     console.log({ dom: ScratchBlocks.Xml.domToText(dom) });
    //   }
    // });
    const dom = ScratchBlocks.Xml.workspaceToDom(headlessWs.current);
    console.log({ dom: ScratchBlocks.Xml.domToPrettyText(dom) });
    // const block = workspace.current.getBlockById('0p?V)vonuOzXWLDCvYP^');
    // console.log({ block: block.type });
    // block.unplug();
  }

  return (
    <>
      <div style={{ height: 40, display: 'flex', width: 300 }}>
        <button style={{ flexGrow: 1, flexShrink: 0 }}>Main</button>
        <button style={{ flexGrow: 1, flexShrink: 0 }}>Custom block</button>
      </div>
      <div
        ref={ScratchBlocksRef}
        style={{ height: '100vh', width: '100%' }}
      ></div>
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button onClick={logWSXml}>Log Workspace XML</button>
        <button onClick={saveWorkspace}>Save Workspace</button>
        <button onClick={loadWorkspace}>Load Workspace</button>
        <button onClick={genJSCode}>Generate JS code</button>
        <button onClick={highlightBlock}>Highlight Block</button>
        <button onClick={refreshToolbox}>Refresh toolbox</button>
        <button onClick={doSomething}>Misc</button>
      </div>
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
  <category
    name="%{BKY_CATEGORY_VARIABLES}"
    id="variables"
    colour="#FF8C1A"
    secondaryColour="#DB6E00"
    custom="VARIABLE">
  </category>
  <category
    name="%{BKY_CATEGORY_MYBLOCKS}"
    id="myBlocks"
    colour="#FF6680"
    secondaryColour="#FF4D6A"
    custom="PROCEDURE">
  </category>
</xml>
`;
