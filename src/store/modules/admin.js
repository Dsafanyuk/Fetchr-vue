/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import axios from '../../axios';

const state = {
  products: [],
  users: [],
  dashboard: {
    categories: [],
    counts: [],
    recentOrders: [],
    topCouriers: [],
    cards: {
      totalDelivered: '',
      totalOrders: '',
      totalUsers: '',
      totalAmountOrdered: '',
    },
  },
};

const mutations = {
  setProducts: (state, data) => {
    state.products.push(data);
  },
  resetProducts: (state) => {
    state.products = [];
  },
  setUsers: (state, data) => {
    state.users.push(data);
  },
  resetUsers: (state) => {
    state.users = [];
  },
  setDashboard: (state, data) => {
    state.dashboard[data.property] = data.data;
  },
  setDashboardCards: (state, data) => {
    state.dashboard.cards[data.property] = data.data;
  },
};

const getters = {
  showProducts(state) {
    return state.products;
  },
  showUsers(state) {
    return state.users;
  },
  showDashboard(state) {
    return state.dashboard;
  },
};

const actions = {
  retrieveProducts: ({ commit }) => {
    commit('resetProducts');
    axios.get('api/admin/products').then((response) => {
      response.data.forEach((product) => {
        commit('setProducts', product);
      });
    });
  },
  createNewProduct: ({ commit, dispatch }, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((formPart) => {
      formData.append(formPart, data[formPart]);
    });
    axios
      .post('api/admin/products', formData)
      .then((response) => {
        console.log(response);
        commit('resetProducts');
        dispatch('retrieveProducts');
      })
      .catch((err) => {
        console.log(err);
      });
  },
  editExistProduct: ({ commit, dispatch }, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((formPart) => {
      formData.append(formPart, data[formPart]);
    });
    axios
      .put(`api/admin/product/${data.product_id}`, formData)
      .then((response) => {
        console.log(response);
        commit('resetProducts');
        dispatch('retrieveProducts');
      })
      .catch((err) => {
        console.log(err);
      });
  },
  retrieveUsers: ({ commit }) => {
    commit('resetUsers');
    axios.get('api/admin/users').then((response) => {
      response.data.forEach((product) => {
        commit('setUsers', product);
      });
    });
  },
  createNewUser: ({ commit, dispatch }, data) => {
    axios
      .post('api/admin/users', data)
      .then((response) => {
        console.log(response);
        commit('resetUsers');
        dispatch('retrieveUsers');
      })
      .catch((err) => {
        console.log(err);
      });
  },
  editExistingUser: ({ commit, dispatch }, data) => {
    axios
      .put(`api/admin/user/${data.user_id}`, data)
      .then((response) => {
        console.log(response);
        commit('resetUsers');
        dispatch('retrieveUsers');
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getDashboard: ({ dispatch }) => {
    dispatch('getProdsByCat');
    dispatch('getTotalOrders');
    dispatch('getTotalDelivered');
    dispatch('getTotalUsers');
    dispatch('getTotalAmountOrdered');
    dispatch('getTopThreeCouriers');
    dispatch('getRecentOrders');
  },
  getProdsByCat: ({ commit }) => {
    axios.get('/api/admin/graphs/prodsSoldByCat').then((response) => {
      const prodCounts = response.data[0][0][0];
      const categories = [];
      const counts = [];
      // Two one dimensional arrays
      Object.keys(prodCounts).forEach((category) => {
        categories.push(category.replace('_', ' '));
        counts.push(prodCounts[category]);
      });
      commit('setDashboard', { property: 'categories', data: categories });
      commit('setDashboard', { property: 'counts', data: counts });
    });
  },
  getTotalOrders: ({ commit }) => {
    axios.get('/api/admin/total/orders').then((response) => {
      commit('setDashboardCards', {
        property: 'totalOrders',
        data: {
          text: 'Total Delivered',
          icon: 'how_to_reg',
          statValue: response.data[0][0].total,
        },
      });
    });
  },
  getTotalDelivered: ({ commit }) => {
    axios.get('/api/admin/total/delivered').then((response) => {
      commit('setDashboardCards', {
        property: 'totalDelivered',
        data: {
          text: 'Total Orders',
          icon: 'shopping_basket',
          statValue: response.data[0][0].total,
        },
      });
    });
  },
  getTotalUsers: ({ commit }) => {
    axios.get('/api/admin/total/users').then((response) => {
      commit('setDashboardCards', {
        property: 'totalUsers',
        data: {
          text: 'Total Users',
          icon: 'group',
          statValue: response.data[0][0].total,
        },
      });
    });
  },
  getTotalAmountOrdered: ({ commit }) => {
    axios.get('/api/admin/total/amountOrdered').then((response) => {
      commit('setDashboardCards', {
        property: 'totalAmountOrdered',
        data: {
          text: 'Total Amount Ordered',
          icon: 'attach_money',
          statValue: response.data[0][0].total,
        },
      });
    });
  },
  getTopThreeCouriers: ({ commit }) => {
    axios.get('/api/admin/couriers/topThree').then((response) => {
      commit('setDashboard', { property: 'topCouriers', data: response.data[0] });
    });
  },
  getRecentOrders: ({ commit }) => {
    axios.get('/api/admin/orders/recent').then((response) => {
      commit('setDashboard', { property: 'recentOrders', data: response.data[0] });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
