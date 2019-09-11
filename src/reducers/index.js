// @flow
import { createActions, handleActions, combineActions } from 'redux-actions';

const defaultState = {
  procedures: { active: false },
  modal: { modalName: '' },
};

export const { activeProcedures, deactiveProcedures } = createActions({
  ACTIVE_PROCEDURES: ({ mutator, callback }) => ({
    active: true,
    mutator,
    callback,
  }),
  DEACTIVE_PROCEDURES: ({ mutator = null }) => ({
    active: false,
    mutator,
    callback: null,
  }),
});

export const { showModal, closeModal } = createActions({
  SHOW_MODAL: (modalName: string) => ({
    modalName,
  }),
  CLOSE_MODAL: () => ({
    modalName: '',
  }),
});

const reducer = handleActions(
  {
    [combineActions(activeProcedures, deactiveProcedures)]: (
      state,
      { payload: { mutator, callback }, type },
    ) => {
      if (type === 'DEACTIVE_PROCEDURES') {
        if (mutator) {
          console.log({ mutator });
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
          callback,
        },
      };
    },
    [combineActions(showModal, closeModal)]: (
      state,
      { payload: { modalName } },
    ) => {
      return {
        ...state,
        modal: { modalName: modalName ? modalName : '' },
      };
    },
  },
  defaultState,
);

export default reducer;
