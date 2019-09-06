// @flow
import { createActions, handleActions, combineActions } from 'redux-actions';

const defaultState = { procedures: { active: false } };

const { activeProcedures, deactiveProcedures } = createActions({
  ACTIVE_PROCEDURES: ({ mutator, callback }) => ({
    active: true,
    mutator,
    callback,
  }),
  DEACTIVE_PROCEDURES: () => ({ active: false, mutator: null, callback: null }),
});

const reducer = handleActions(
  {
    [combineActions(activeProcedures, deactiveProcedures)]: (
      state,
      { payload: { mutator, callback }, type },
    ) => {
      if (type === 'DEACTIVE_PROCEDURES') {
        if (mutator) {
          state.procedures.callback(mutator);
        }
      }

      return {
        ...state,
        procedures: {
          ...state.procedures,
          active: !state.procedures.active,
          mutator,
          callback,
        },
      };
    },
  },
  defaultState,
);

export { activeProcedures };
export { deactiveProcedures };

export default reducer;
