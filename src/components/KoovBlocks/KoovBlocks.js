// @flow
import React, { Component } from 'react';
import {
  connect,
  // useSelector
} from 'react-redux';

import ScratchBlocks from '../../lib/koov-scratch-blocks';
import { activeProcedures } from '../../reducers';

type Props = {
  activeProcedures: (params: {
    mutator: Object,
    callback: () => void,
  }) => void,
};

type State = {
  tabMode: string,
};

class KoovBlocks extends Component<Props, State> {
  ScratchBlocksRef: ?HTMLDivElement;
  workspace: ScratchBlocks = null;
  headlessWs: ScratchBlocks = null;
  project = null;
  domText = '';
  // const procedures = useSelector(({ procedures }) => procedures);

  state = {
    tabMode: 'code',
  };

  constructor() {
    super();
    this.domText = window.localStorage.getItem('@@ws');
  }

  componentDidMount() {
    const { activeProcedures } = this.props;

    this.headlessWs = new ScratchBlocks.Workspace();
    // console.log(wsHeadless.current);

    this.workspace = ScratchBlocks.inject(this.ScratchBlocksRef, {
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

    this.workspace.scrollbar.set(0, 0);

    // Custom procedures
    ScratchBlocks.Procedures.externalProcedureDefCallback = (
      mutator,
      callback,
    ) => {
      activeProcedures({ mutator, callback });
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

    this.workspace.addChangeListener(this.handleChangeWs);

    this.showCode();

    // For debugger only
    window.ws = this.workspace;
    window.ScratchBlocks = ScratchBlocks;
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabMode } = this.state;
    if (prevState.tabMode !== this.state.tabMode) {
      switch (tabMode) {
        case 'code':
          this.showCode();
          return;
        case 'procedures':
          this.showProcedures();
          return;
        default:
          return;
      }
    }
  }

  componentWillUnmount() {
    if (this.headlessWs && this.workspace) {
      this.headlessWs.dispose();
      this.workspace.dispose();
    }
  }

  handleChangeWs = event => {
    if (event.type === ScratchBlocks.Events.UI) {
      return;
    }

    const json = event.toJson();
    console.log({ type: json.type });
  };

  logWSXml = () => {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(this.workspace);
    const domText = ScratchBlocks.Xml.domToText(wsDom);
    console.log(wsDom);
    console.log(domText);
  };

  saveWorkspace = () => {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(this.headlessWs);
    this.project = ScratchBlocks.Xml.domToText(wsDom);

    window.localStorage.setItem('@@ws', this.project);
  };

  loadWorkspace = () => {};

  genJSCode = () => {
    const code = ScratchBlocks.JavaScript.workspaceToCode(this.workspace);
    console.log(code);
  };

  highlightBlock = () => {
    ScratchBlocks.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    ScratchBlocks.JavaScript.addReservedWords('highlightBlock');
    if (this.workspace) {
      this.workspace.highlightBlock(')[dIl1~SRuZuq7RtMu3.', true);
    }
  };

  refreshToolbox = () => {
    this.workspace.refreshToolboxSelection_();
    this.workspace.toolbox_.scrollToCategoryById('myBlocks');
  };

  doSomething = () => {
    const dom = ScratchBlocks.Xml.workspaceToDom(this.headlessWs);
    console.log({ dom: ScratchBlocks.Xml.domToPrettyText(dom) });
  };

  setTabMode = (tabMode: string) => {
    // this.workspace.removeChangeListener(this.handleChangeWs);
    this.setState({ tabMode }, () => {
      // this.workspace.addChangeListener(this.handleChangeWs);
    });
  };

  showCode = () => {
    const dom = ScratchBlocks.Xml.textToDom(this.domText);
    this.headlessWs.clear();
    ScratchBlocks.Xml.domToWorkspace(dom, this.headlessWs);
    const domParser = new window.DOMParser();
    const doc = domParser.parseFromString(this.domText, 'text/html');
    const xml = document.createElement('xml');
    xml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const childs = doc.querySelector('xml').children;
    for (let i = 0; i <= childs.length - 1; i++) {
      if (childs[i].getAttribute('type') !== 'procedures_definition') {
        xml.innerHTML += childs[i].outerHTML;
      }
    }

    this.workspace.clear();
    ScratchBlocks.Xml.domToWorkspace(xml, this.workspace);
    console.log(xml);
  };

  showProcedures = () => {
    const dom = ScratchBlocks.Xml.textToDom(this.domText);
    this.headlessWs.clear();
    ScratchBlocks.Xml.domToWorkspace(dom, this.headlessWs);
    const domParser = new window.DOMParser();
    const doc = domParser.parseFromString(this.domText, 'text/html');
    const xml = document.createElement('xml');
    xml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    doc.querySelectorAll('block').forEach(el => {
      if (el.getAttribute('type') === 'procedures_definition') {
        xml.innerHTML += el.outerHTML;
      }
    });

    this.workspace.clear();
    ScratchBlocks.Xml.domToWorkspace(xml, this.workspace);
    console.log(xml);
  };

  render() {
    const { tabMode } = this.state;

    return (
      <>
        <div style={{ height: 40, display: 'flex', width: 300 }}>
          <button
            style={{
              flexGrow: 1,
              flexShrink: 0,
              backgroundColor: tabMode === 'code' ? 'red' : 'white',
            }}
            onClick={() => {
              this.setTabMode('code');
            }}
          >
            Main
          </button>
          <button
            style={{
              flexGrow: 1,
              flexShrink: 0,
              backgroundColor: tabMode === 'procedures' ? 'red' : 'white',
            }}
            onClick={() => {
              this.setTabMode('procedures');
            }}
          >
            Custom block
          </button>
        </div>
        <div
          ref={ref => {
            this.ScratchBlocksRef = ref;
          }}
          style={{ height: 'calc(100vh - 40px)', width: '100%' }}
        ></div>
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button onClick={this.logWSXml}>Log Workspace XML</button>
          <button onClick={this.saveWorkspace}>Save Workspace</button>
          <button onClick={this.loadWorkspace}>Load Workspace</button>
          <button onClick={this.genJSCode}>Generate JS code</button>
          <button onClick={this.highlightBlock}>Highlight Block</button>
          <button onClick={this.refreshToolbox}>Refresh toolbox</button>
          <button onClick={this.doSomething}>Misc</button>
        </div>
      </>
    );
  }
}

const mapDispatchToProp = dispatch => ({
  activeProcedures: ({
    mutator,
    callback,
  }: {
    mutator: Object,
    callback: () => void,
  }) => {
    dispatch(activeProcedures({ mutator, callback }));
  },
});

export default connect(
  null,
  mapDispatchToProp,
)(KoovBlocks);

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
