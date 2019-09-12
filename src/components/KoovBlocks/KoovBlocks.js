// @flow
import React, { Component } from 'react';
import {
  connect,
  // useSelector
} from 'react-redux';

import ScratchBlocks from '../../lib/koov-scratch-blocks';
import ProceduresModal from '../Modals/ProceduresModal';
import WorkspaceModal from '../Modals/WorkspaceModal';
import { activeProcedures, showModal } from '../../reducers';

type Props = {
  activeProcedures: (params: {
    mutator: Object,
    callback: () => void,
  }) => void,
  showWorkspaceModal: (modalName: string) => void,
};

type State = {
  tabMode: string,
};

class KoovBlocks extends Component<Props, State> {
  ScratchBlocksRef: ?HTMLDivElement;
  headlessBlocksRef: ?HTMLDivElement;
  workspace: ScratchBlocks.Workspace = null;
  headlessWs: ScratchBlocks.Workspace = null;
  project = null;
  allowSync = false;

  state = {
    tabMode: 'code',
  };

  constructor() {
    super();
    const domText = window.localStorage.getItem('@@ws');
    const dom = ScratchBlocks.Xml.textToDom(domText);
    this.headlessWs = new ScratchBlocks.Workspace();
    ScratchBlocks.Xml.domToWorkspace(dom, this.headlessWs);
    const toolbox = new ScratchBlocks.Toolbox(this.headlessWs);
    console.log({ toolbox: toolbox });
  }

  componentDidMount() {
    const { activeProcedures } = this.props;

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

    this.workspace.headlessWs_ = this.headlessWs;

    // Custom procedures
    ScratchBlocks.Procedures.externalProcedureDefCallback = (
      mutator,
      callback,
    ) => {
      activeProcedures({ mutator, callback });
    };

    this.workspace.registerToolboxCategoryCallback(
      ScratchBlocks.PROCEDURE_CATEGORY_NAME,
      ws => {
        return ScratchBlocks.Procedures.flyoutCategory(ws, ws._headlessWs);
      },
    );

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
    console.log(this.allowSync);
    const { tabMode } = this.state;
    if (prevState.tabMode !== tabMode) {
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
    this.allowSync = true;
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

    if (event.type === ScratchBlocks.Events.FINISHED_LOADING) {
      console.log({ type: json.type });
      this.allowSync = true;
      return;
    }

    if (this.allowSync) {
      console.log({ type: json.type, json });
      const mirrorEvents = ScratchBlocks.Events.fromJson(json, this.headlessWs);
      mirrorEvents.run(true);
    }
  };

  logWSXml = () => {
    const wsDom = ScratchBlocks.Xml.workspaceToDom(this.workspace);
    const domText = ScratchBlocks.Xml.domToPrettyText(wsDom);
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
    // ScratchBlocks.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    // ScratchBlocks.JavaScript.addReservedWords('highlightBlock');
    // if (this.workspace) {
    //   this.workspace.highlightBlock(')[dIl1~SRuZuq7RtMu3.', true);
    // }
  };

  refreshToolbox = () => {
    this.workspace.refreshToolboxSelection_();
    // this.workspace.toolbox_.scrollToCategoryById('myBlocks');
  };

  doSomething = () => {
    const dom = ScratchBlocks.Xml.workspaceToDom(this.headlessWs);
    console.log({ dom: ScratchBlocks.Xml.domToPrettyText(dom) });
  };

  setTabMode = (tabMode: string) => {
    this.allowSync = false;
    this.setState({ tabMode });
  };

  showCode = () => {
    const dom = ScratchBlocks.Xml.workspaceToDom(this.headlessWs);
    const domText = ScratchBlocks.Xml.domToText(dom);
    const domParser = new window.DOMParser();
    const doc = domParser.parseFromString(domText, 'text/html');
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
    this.workspace.refreshToolboxSelection_();
    console.log(xml);
  };

  showProcedures = () => {
    const dom = ScratchBlocks.Xml.workspaceToDom(this.headlessWs);
    const domText = ScratchBlocks.Xml.domToText(dom);
    const domParser = new window.DOMParser();
    const doc = domParser.parseFromString(domText, 'text/html');
    const xml = document.createElement('xml');
    xml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const childs = doc.querySelector('xml').children;
    for (let i = 0; i <= childs.length - 1; i++) {
      if (
        childs[i].getAttribute('type') === 'procedures_definition' ||
        childs[i].tagName === 'VARIABLES'
      ) {
        xml.innerHTML += childs[i].outerHTML;
      }
    }

    this.workspace.clear();
    ScratchBlocks.Xml.domToWorkspace(xml, this.workspace);
    this.workspace.refreshToolboxSelection_();
    console.log(xml);
  };

  handleProceduresModal = () => {
    // TODO: This is hack, need find other way
    window.setTimeout(() => {
      this.setTabMode('procedures');
      this.workspace.refreshToolboxSelection_();
    }, 1000);
    // this.workspace.toolbox_.scrollToCategoryById('myBlocks');
  };

  render() {
    const { showWorkspaceModal } = this.props;
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
            Code
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
          <button onClick={this.logWSXml} className="btn btn-light btn-sm">
            Log Workspace XML
          </button>
          <button
            onClick={this.saveWorkspace}
            className="btn btn-primary btn-sm"
          >
            Save Workspace
          </button>
          <button onClick={this.loadWorkspace} className="btn btn-light btn-sm">
            Load Workspace
          </button>
          <button onClick={this.genJSCode} className="btn btn-light btn-sm">
            Generate JS code
          </button>
          <button
            onClick={this.highlightBlock}
            className="btn btn-light btn-sm"
          >
            Highlight Block
          </button>
          <button
            onClick={this.refreshToolbox}
            className="btn btn-light btn-sm"
          >
            Refresh toolbox
          </button>
          <button
            onClick={() => {
              showWorkspaceModal('workspace-modal');
            }}
            className="btn btn-primary btn-sm"
          >
            Show headless WS
          </button>
          <button onClick={this.doSomething} className="btn btn-light btn-sm">
            Misc
          </button>
        </div>
        <div
          ref={ref => {
            this.headlessBlocksRef = ref;
          }}
        ></div>
        <WorkspaceModal ws={this.headlessWs} />
        <ProceduresModal handleProceduresModal={this.handleProceduresModal} />
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
  showWorkspaceModal: modalName => {
    dispatch(showModal(modalName));
  },
});

export default connect(
  null,
  mapDispatchToProp,
)(KoovBlocks);

const toolbox = `
<xml id="toolbox" style="display: none">
  <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
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
