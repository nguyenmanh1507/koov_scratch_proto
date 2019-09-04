export default function javascriptEvents(ScratchBlocks) {
  ScratchBlocks.JavaScript['event_whenflagclicked'] = function(block) {
    return ['flagClicked();', ScratchBlocks.JavaScript.ORDER_FUNCTION_CALL];
  };

  // keyPressed(keyCode)
  ScratchBlocks.JavaScript['event_whenkeypressed'] = function(block) {
    const keyCode = ScratchBlocks.JavaScript.quote_(
      block.getFieldValue('KEY_OPTION'),
    );

    const code = `koov.addKeyPressEvent(${keyCode}, function() {\n})`;
    return [code, ScratchBlocks.JavaScript.ORDER_FUNCTION_CALL];
  };
}
