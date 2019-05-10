import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    pass: '',
    login: '',
    cookies: '',
    partnerList: ''
  },
  mutations:{
    setState(state, {login, pass}){
      chrome.storage.sync.set({login1: login,  password: pass}, function() {
      });
      state.login = login
      state.pass = pass
    },
    setCurrentPartner(state, partner){
      chrome.storage.sync.set({CurParId: partner.Id,  CurParName: partner.Name, CurParEmail: partner.Email, CurParPass: partner.Password}, function() {
      });
      localStorage.setItem('partnerId', partner.Id);
      state.CurParId = partner.Id
      state.CurParName = partner.Name
      state.CurParEmail = partner.Email
      state.CurParPass = partner.Password
    },
    setCookies(state, cookie){
      state.cookies = cookie
    },
    setPartners(state, partnerList){
      state.partnerList = partnerList
    }
  },
  actions:{
    addLoginPass({commit}, {login, pass}){
      commit('setState', {login, pass});
    },
    addCookies({commit}, cookies){
      commit('setCookies', cookies);
    },
    addPartners({commit}, partnerList){
      commit('setPartners', partnerList);
    },
    addCurrentPartner({commit}, part){
      commit('setCurrentPartner', part);
    }
  },
  getters:{
    getList(){
      return state.partnerList;
    }
  }
});
