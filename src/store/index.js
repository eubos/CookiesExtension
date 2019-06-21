import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isEnabled: true,
    pass: '',
    login: '',
    cookies: '',
    partnerList: [],
    allPartnersList: []
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
      localStorage.setItem('inProgress', false);
    },
    setAllPartners(state, partnerList){
      state.allPartnersList = partnerList
    },
    setOnOff(state, flag){
      state.isEnabled = flag
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
    addAllPartners({commit}, partnerList){
      commit('setAllPartners', partnerList);
    },
    addCurrentPartner({commit}, part){
      commit('setCurrentPartner', part);
    },
    setEnable({commit}, flag){
      commit('setOnOff', flag)
    }
  },
  getters:{
    getPartners: state => () => state.partnerList
  }
});
