import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import moduleAuthorization from './modules/authorization';
import questionnaire from './modules/questionnaire_/main';
import currencies from './modules/currency';
import { dynamicsObject } from "@/interfaces";

export default createStore({
  state: {
    timer: false,
    modal: {},
    notification: {} as dynamicsObject,
    questionnaireError: {} as dynamicsObject,
    pendingRequest: false,
  },
  mutations: {
    startTimer(state) {
      state.timer = true;
    },

    createModal(state, modal) {
      state.modal = modal;
    },
    destroyModal(state) {
      state.modal = {};
    },

    createNotification(state, notification) {
      state.notification = notification;
    },
    destroyNotification(state) {
      state.notification = {};
    },
    createQuestionnaireError(state, err) {
      state.questionnaireError = err;
    },
    destroyQuestionnaireError(state) {
      state.questionnaireError = {};
    },
    togglePendingRequest(state, status) {
      state.pendingRequest = status;
    }
  },
  actions: {},
  getters: {
    timer: (state) => state.timer,
    modal: (state) => state.modal,
    notification: (state) => state.notification,
    questionnaireError: (state) => state.questionnaireError,
    pendingRequest: (state) => state.pendingRequest
  },
  modules: {
    moduleAuthorization,
    questionnaire,
    currencies
  },
  plugins: [
    createPersistedState({
      paths: ["moduleAuthorization"],
    }),
  ],
});
