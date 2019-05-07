import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pass: '',
    login: '',
    cookies: '',
    partnerList: '',
    currentPartner: ''
  },
  plugins: [createPersistedState()],
  mutations:{
    setState(state, {login, pass}){
      chrome.storage.sync.set({login1: login,  password: pass}, function() {
        console.log('Value is set to ' + login + pass);
      });
    state.login = login
    state.pass = pass
    },
    setCookies(state, cookie){
      state.cookies = cookie
    },
    setPartners(state, partnerList){
      state.partnerList = partnerList
    },
    setCurrentPartner(state, partner){
      state.currentPartner = partner
      alert(state.currentPartner.Name)
    }
  },
  actions:{
    addLoginPass({commit}, {login, pass}){
      console.log({login, pass});
      commit('setState', {login, pass});
    },
    addCookies({commit}, cookies){
      commit('setCookies', cookies);
    },
    addPartners({commit}, partnerList){
      commit('setPartners', partnerList);
    },
    addCurrentPartner({commit}, partner){
      commit('setCurrentPartner', partner);
    }
  },
  getters:{
    getLogin(state){
      return state.login;
    }
  }
});
