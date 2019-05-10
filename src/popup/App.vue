<template>
  <div class="main"> 
        <h3>Partners without cookies:</h3>
        <ul><li v-for="partner in partnerList" v-bind:key="partner.Id">{{partner.Name}} {{partner.Email}} {{partner.Password}} {{partner.Id}}
        <button style="float: right" @click="save(partner)"><a href="https://auth.uber.com/login" target="_blank">FIX IT</a></button>
        </li>
        </ul>
        <hr>
        <button @click = "getPartners">Get Partners</button>
        <hr>
        <button @click="showCurrentPartner">showCurrentPartner</button>
        <hr>
        <h3>currentPartner:</h3>
        <div v-bind="currentPartner">{{currentPartner}}</div>
        <hr>
        <button @click="sendCookies">sendCookies</button>
        <hr>
        <button @click="showCookies">showCookies</button>
        <h3>cookies:</h3>
        <div>{{cook}}</div>
        
    </div>
</template>

<script>
import store from '../store';
export default {
  data() {
    return {
       cook: '',
       currentPartner: 'none'
    };
  },
  methods:{
    save(partner){

      const user = {
        login: partner.Email,
        pass: partner.Password
      }
      store.dispatch('addCurrentPartner', partner)
      store.dispatch('addLoginPass', user)
    },
    showCookies(){
      this.cook  = store.state.cookies
    },
    showCurrentPartner(){
      this.currentPartner = store.state.CurParId + ' ' + store.state.CurParName + ' ' + store.state.CurParEmail + ' ' + store.state.CurParPass
    },
    getPartners(){
     chrome.runtime.sendMessage({cmd: "getPartners"});
    },
    sendCookies(){
     chrome.runtime.sendMessage({cmd: "sendCookies"});
    }
  },
  computed:{
   partnerList()
      {
        return store.state.partnerList
      }
    
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
input {
  margin: 5px;
}
.main{
  width: 500px;
  height: 800px;
}
</style>
