/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import browserCookies from 'browser-cookies';
import axios from '../../axios';

const state = {
  showWallet: false,
  walletBalance: '',
};

const actions = {
  getWalletBalance: (state) => {
    axios
      .get(`/api/users/${browserCookies.get('user_id')}/wallet`)
      .then((response) => {
        state.commit('setWallet', response.data[0].wallet.toFixed(2));
      })
      .catch(() => {
        this.walletBalance = 'error';
      });
  },
};
const mutations = {
  setWallet: (state, value) => {
    state.walletBalance = value;
  },
  toggleWallet: (state, value) => {
    state.showWallet = value;
  },
};
const getters = {
  walletBalance(state) {
    return state.walletBalance;
  },
  walletIsActive(state) {
    return state.showWallet;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
