// @flow
import { createActions, handleActions, combineActions } from 'redux-actions';

const defaultState = { procedures: { active: false } };

const { activeProcedures, deactiveProcedures } = createActions({
  ACTIVE_PROCEDURES: ({ mutator, callback }) => ({
    active: true,
    mutator,
    callback
  }),
  DEACTIVE_PROCEDURES: ({ mutator = null }) => ({
    active: false,
    mutator,
    callback: null
  })
});

const reducer = handleActions(
  {
    [combineActions(activeProcedures, deactiveProcedures)]: (
      state,
      { payload: { mutator, callback }, type }
    ) => {
      if (type === 'DEACTIVE_PROCEDURES') {
        if (mutator) {
          console.log({mutator})
          state.procedures.callback(mutator);
          mutator = null;
        }
      }

      return {
        ...state,
        procedures: {
          ...state.procedures,
          active: !state.procedures.active,
          mutator,
          callback
        }
      };
    }
  },
  defaultState
);

export { activeProcedures };
export { deactiveProcedures };

export default reducer;
