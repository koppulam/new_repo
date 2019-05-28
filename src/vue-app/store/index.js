import Vue from 'vue';
import Vuex from 'vuex';
import actions from '../actions/index.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        quantity: 0
    },
    mutations: {
        INCREMENT_QUANTITY(state) {
            state.quantity = state.quantity + 1;
        },
        DECREMENT_QUANTITY(state) {
            state.quantity = state.quantity - 1;
        }
    },
    actions
});