export default function javascriptControl(ScratchBlocks) {
  ScratchBlocks.JavaScript['math_positive_number'] = function(block) {
    // Numeric value.
    let code = parseFloat(block.getFieldValue('NUM'));
    let order;
    if (code === Infinity) {
      code = 'float("inf")';
      order = ScratchBlocks.JavaScript.ORDER_FUNCTION_CALL;
    } else if (code === -Infinity) {
      code = '-float("inf")';
      order = ScratchBlocks.JavaScript.ORDER_UNARY_SIGN;
    } else {
      order =
        code < 0
          ? ScratchBlocks.JavaScript.ORDER_UNARY_SIGN
          : ScratchBlocks.JavaScript.ORDER_ATOMIC;
    }
    return [code, order];
  };

  ScratchBlocks.JavaScript['math_positive_number'] = function(block) {
    // Numeric value.
    const code = parseFloat(block.getFieldValue('NUM')) || 0;
    return [code, ScratchBlocks.JavaScript.ORDER_ATOMIC];
  };

  ScratchBlocks.JavaScript['control_wait'] = function(block) {
    const duration = ScratchBlocks.JavaScript.valueToCode(
      block,
      'DURATION',
      ScratchBlocks.JavaScript.ORDER_ATOMIC,
    );
    const code = `wait(${duration});`;
    return code;
  };
}
